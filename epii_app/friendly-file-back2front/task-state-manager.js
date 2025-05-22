/**
 * Task State Manager
 * Manages task state and QL cycle transitions for the A2A framework
 *
 * Bimba Coordinate: #5-4
 * Represents the orchestration component of the Siva-Shakti layer
 */

const { v4: uuidv4 } = require('uuid');

class TaskStateManager {
  constructor(taskId = uuidv4(), sessionId = uuidv4()) {
    this.task = {
      id: taskId,
      sessionId,
      status: {
        state: "submitted", // A2A state
        qlStage: 0, // Quaternary Logic stage (0-5)
        qlStageName: "A-logos", // Human-readable QL stage name
        timestamp: new Date().toISOString()
      },
      contextFrame: null, // Current context frame
      subsystemPath: null, // Current subsystem path
      history: [],
      artifacts: [],
      metadata: {
        bimbaCoordinates: [], // Relevant Bimba coordinates
        qlTransitions: [], // Track QL stage transitions
        userArchetype: null, // User's archetypal representation
        epistemologyArchetype: null // Current epistemological approach
      }
    };
  }

  // Transition to next QL stage
  advanceQLStage() {
    const currentStage = this.task.status.qlStage;
    const nextStage = (currentStage + 1) % 6; // Cycle through 0-5

    // Map QL stage to name
    const qlStageNames = [
      "A-logos", // 0
      "Pre-logos", // 1 - Changed from Pro-logos to align with QL terminology
      "Pro-logos", // 2 - Changed from Dia-logos to align with QL terminology
      "Logos", // 3
      "Epi-logos", // 4
      "An-a-logos" // 5
    ];

    this.task.status.qlStage = nextStage;
    this.task.status.qlStageName = qlStageNames[nextStage];

    this.task.metadata.qlTransitions.push({
      from: currentStage,
      to: nextStage,
      timestamp: new Date().toISOString(),
      fromName: qlStageNames[currentStage],
      toName: qlStageNames[nextStage]
    });

    // Map QL stage to A2A state
    switch(nextStage) {
      case 0: // A-logos
        this.task.status.state = "submitted";
        break;
      case 1: // Pre-logos
      case 2: // Pro-logos
      case 3: // Logos
        this.task.status.state = "working";
        break;
      case 4: // Epi-logos
        this.task.status.state = "working"; // Still working but in meta-synthesis
        break;
      case 5: // An-a-logos
        this.task.status.state = "completed";
        break;
    }

    // Update context frame based on new QL stage
    this.determineContextFrame();

    return this.task;
  }

  // Set context frame
  setContextFrame(contextFrame) {
    this.task.contextFrame = contextFrame;
    return this.task;
  }

  // Determine context frame based on QL stage
  determineContextFrame() {
    const qlStage = this.task.status.qlStage;
    let contextFrame;

    switch (qlStage) {
      case 0:
      case 1:
        contextFrame = '(0/1)'; // Foundation/Identity
        break;
      case 2:
        contextFrame = '(0/1/2)'; // Process/Activation
        break;
      case 3:
        contextFrame = '(0/1/2/3)'; // Pattern/Integration
        break;
      case 4:
        contextFrame = '(4.0-4/5)'; // Application/Context
        break;
      case 5:
        contextFrame = '(5/0)'; // Synthesis/Renewal
        break;
      default:
        contextFrame = '(0-5)'; // Full cycle
    }

    return this.setContextFrame(contextFrame);
  }

  // Set subsystem path
  setSubsystemPath(subsystemPath) {
    this.task.subsystemPath = subsystemPath;
    return this.task;
  }

  // Set Bimba coordinates
  setBimbaCoordinates(coordinates) {
    if (Array.isArray(coordinates)) {
      this.task.metadata.bimbaCoordinates = coordinates;
    } else if (typeof coordinates === 'string') {
      this.task.metadata.bimbaCoordinates = [coordinates];
    }
    return this.task;
  }

  // Add a single Bimba coordinate
  addBimbaCoordinate(coordinate) {
    if (!this.task.metadata.bimbaCoordinates.includes(coordinate)) {
      this.task.metadata.bimbaCoordinates.push(coordinate);
    }
    return this.task;
  }

  // Set archetypal information
  setArchetypes(userArchetype, epistemologyArchetype) {
    this.task.metadata.userArchetype = userArchetype;
    this.task.metadata.epistemologyArchetype = epistemologyArchetype;
    return this.task;
  }

  // Add artifact
  addArtifact(artifact) {
    this.task.artifacts.push({
      ...artifact,
      timestamp: new Date().toISOString()
    });
    return this.task;
  }

  // Add message to history
  addMessage(message) {
    this.task.history.push({
      ...message,
      timestamp: new Date().toISOString()
    });
    return this.task;
  }

  // Update task state
  updateState(state) {
    this.task.status.state = state;
    this.task.status.timestamp = new Date().toISOString();
    return this.task;
  }

  // Get current task state
  getState() {
    return this.task;
  }

  // Get current QL stage
  getQLStage() {
    return {
      stage: this.task.status.qlStage,
      name: this.task.status.qlStageName
    };
  }

  // Reset task to initial state
  reset() {
    this.task.status.state = "submitted";
    this.task.status.qlStage = 0;
    this.task.status.qlStageName = "A-logos";
    this.task.status.timestamp = new Date().toISOString();
    this.task.history = [];
    this.task.artifacts = [];
    this.task.metadata.qlTransitions = [];
    return this.task;
  }
}

module.exports = TaskStateManager;
