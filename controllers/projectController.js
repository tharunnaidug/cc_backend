// controllers/projectController.js
import Project from "../models/Project.js";

//
// GET /api/projects
// query: ?status=recruiting&department=BCA&tech=React&q=lost
//
export const getProjects = async (req, res) => {
  try {
    const { status, department, tech, q, my } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (department) filter.department = department;
    if (tech) filter.techStack = { $in: [tech] };

    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }

    // if `my=true`, show only projects where user is member
    if (my === "true") {
      filter.members = { $in: [req.user._id] };
    }

    const projects = await Project.find(filter)
      .populate("owner", "name department year avatarUrl")
      .populate("members", "name department year avatarUrl")
      .sort({ createdAt: -1 });

    res.json({message:"fetched Successfully",projects});
  } catch (err) {
    console.error("getProjects error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

//
// POST /api/projects
// body: { title, description, techStack, lookingFor, department, visibility, links }
//
export const createProject = async (req, res) => {
  try {
    const { title, description, techStack, lookingFor, department, links } =
      req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const project = await Project.create({
      title,
      description,
      techStack: techStack || [],
      lookingFor: lookingFor || [],
      department,
      visibility:  "college",
      links: links || {},
      owner: req.user._id,
      members: [req.user._id], // creator is also a member
    });

    const populated = await Project.findById(project._id)
      .populate("owner", "name department year avatarUrl")
      .populate("members", "name department year avatarUrl");

    res.status(201).json(populated);
  } catch (err) {
    console.error("createProject error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

//
// GET /api/projects/:id
//
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name department year avatarUrl")
      .populate("members", "name department year avatarUrl")
      .populate("joinRequests.user", "name department year avatarUrl");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (err) {
    console.error("getProjectById error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

//
// POST /api/projects/:id/join
// body: { message? }
//
export const requestToJoin = async (req, res) => {
  try {
    const { message } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    const userId = req.user._id.toString();

    const isMember = project.members.some((m) => m.toString() === userId);
    if (isMember) {
      return res.status(400).json({ message: "You are already a member of this project" });
    }

    const alreadyRequested = project.joinRequests.some(
      (jr) => jr.user.toString() === userId
    );
    if (alreadyRequested) {
      return res.status(400).json({ message: "You already requested to join" });
    }

    project.joinRequests.push({
      user: req.user._id,
      message: message || "",
    });

    await project.save();

    res.json({ message: "Join request sent" });
  } catch (err) {
    console.error("requestToJoin error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

//
// POST /api/projects/:id/requests/:requestId
// body: { action: "accept" | "reject" }
// only owner can accept/reject
//
export const handleJoinRequest = async (req, res) => {
  try {
    const { action } = req.body; // 'accept' or 'reject'
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only owner can manage join requests" });
    }

    const jr = project.joinRequests.id(req.params.requestId);
    if (!jr) return res.status(404).json({ message: "Join request not found" });

    if (action === "accept") {
      const alreadyMember = project.members.some(
        (m) => m.toString() === jr.user.toString()
      );
      if (!alreadyMember) {
        project.members.push(jr.user);
      }
    }

    jr.remove();
    await project.save();

    res.json({ message: `Request ${action}ed` });
  } catch (err) {
    console.error("handleJoinRequest error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
