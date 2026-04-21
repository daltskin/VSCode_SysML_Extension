// View Showcase — demonstrates all supported view scoping features
// See: SysML v2 Spec §8.2.2.26, StandardViewDefinitions, Views library

package ViewShowcase {

  import StandardViewDefinitions::*;

  // ─── Model Elements ───────────────────────────────────────────

  part def Sensor {
    out port dataOut;
    attribute accuracy;
  }

  part def Actuator {
    in port cmdIn;
    attribute responseTime;
  }

  part def Controller {
    in port sensorData;
    out port actuatorCmd;

    action def ProcessInput;
    action def ComputeOutput;
  }

  part def ControlSystem {
    #Safety part sensor : Sensor;
    #Safety part actuator : Actuator;
    part controller : Controller;
    #Security part secureModule;

    connection sensorLink connect sensor.dataOut to controller.sensorData;
    connection actuatorLink connect controller.actuatorCmd to actuator.cmdIn;
  }

  part def PowerSupply {
    port powerOut;
    attribute voltage;
  }

  item def SafetyReport;
  item def TestResult;

  enum def Priority {
    enum low;
    enum medium;
    enum high;
  }

  // ─── Behaviour ────────────────────────────────────────────────

  action def 'Operate System' {
    first start;
    then action initialize;
    then action monitor;
    then action respond;
    then done;
  }

  state def OperatingStates {
    entry state idle;
    then state active;
    then state fault;
  }

  // ─── Requirements ─────────────────────────────────────────────

  requirement def ReliabilityReq {
    doc /* The system shall operate without failure for 1000 hours. */
    subject sys : ControlSystem;
  }

  requirement def PerformanceReq {
    doc /* The system response time shall be less than 100ms. */
    subject sys : ControlSystem;
  }

  requirement systemRequirements {
    requirement reliability : ReliabilityReq;
    requirement performance : PerformanceReq;
  }

  // ─── Use Cases ────────────────────────────────────────────────

  use case def 'Monitor Environment' {
    subject sys : ControlSystem;
    actor operator;
  }

  // ─── Metadata Definitions ─────────────────────────────────────

  metadata def Safety;
  metadata def Security;

  // ─── Viewpoints ───────────────────────────────────────────────

  concern 'Understand system structure' {
    doc /* Stakeholders need to see how the system is decomposed. */
    stakeholder engineer;
  }

  viewpoint 'structural overview' {
    frame 'Understand system structure';
    require constraint {
      doc /* Show hierarchical part decomposition. */
    }
  }

  // ─── View Definitions (templates with filters + rendering) ────

  // Parts-only filter template
  view def 'Parts Only' {
    satisfy 'structural overview';
    filter @ SysML::PartUsage;
  }

  // Requirements-only filter template
  view def 'Requirements Only' {
    filter @ SysML::RequirementUsage;
  }

  // Tree rendering template (inherited by children)
  view def 'Tree Rendering' {
    render Views::asTreeDiagram;
  }

  // ════════════════════════════════════════════════════════════════
  // VIEW USAGES — each demonstrates a specific supported feature
  // ════════════════════════════════════════════════════════════════

  // ─── 1. StandardViewDefinitions ───────────────────────────────

  // GeneralView → renders as General View (ELK)
  view 'General Overview' : GeneralView {
    expose ControlSystem;
    expose Sensor;
    expose Actuator;
    expose Controller;
    expose PowerSupply;
    expose Priority;
  }

  // InterconnectionView → renders as framed IBD (container boundary shown)
  view 'System IBD Framed' : InterconnectionView {
    expose ControlSystem;
  }

  // InterconnectionView with wildcard → unframed IBD (children promoted)
  view 'System IBD Unframed' : InterconnectionView {
    expose ControlSystem::*;
  }

  // ActionFlowView → renders as Activity diagram
  view 'System Behaviour' : ActionFlowView {
    expose 'Operate System';
  }

  // StateTransitionView → renders as State diagram
  view 'Operating States' : StateTransitionView {
    expose OperatingStates;
  }

  // BrowserView → renders as Tree view
  view 'Model Browser' : BrowserView {
    expose ViewShowcase::**;
  }

  // ─── 2. render directives ─────────────────────────────────────

  // render Views::asElementTable → renders as Table
  view 'Parts Table' : 'Parts Only' {
    expose ViewShowcase::**;
    render Views::asElementTable;
  }

  // render Views::asTreeDiagram → renders as Tree
  view 'System Tree' : GeneralView {
    expose ControlSystem::**;
    render Views::asTreeDiagram;
  }

  // render Views::asInterconnectionDiagram → renders as IBD
  view 'Interconnection Diagram' : GeneralView {
    expose ControlSystem;
    render Views::asInterconnectionDiagram;
  }

  // render Views::asTextualNotation → renders as SysML textual syntax
  view 'Textual Notation' : GeneralView {
    expose ControlSystem;
    render Views::asTextualNotation;
  }

  // ─── 3. View def inheritance ──────────────────────────────────

  // Inherits filter @SysML::RequirementUsage from 'Requirements Only' view def
  view 'All Requirements' : 'Requirements Only' {
    expose ViewShowcase::**;
  }

  // Inherits render asTreeDiagram from 'Tree Rendering' view def
  view 'Inherited Tree Render' : 'Tree Rendering' {
    expose ViewShowcase::**;
  }

  // ─── 4. Boolean filter expressions ────────────────────────────

  // OR filter: parts with Safety OR Security metadata
  view 'Safety or Security' : GeneralView {
    expose ControlSystem::**;
    filter @Safety or @Security;
  }

  // AND filter: same scope but only Safety (subset of OR result)
  view 'Safe Parts Only' : GeneralView {
    expose ControlSystem::**;
    filter @Safety;
  }

  // ─── 5. Recursive wildcard ────────────────────────────────────

  // Expose everything recursively
  view 'Full Model' : GeneralView {
    expose ViewShowcase::**;
  }

  // ─── 6. Viewpoint satisfaction ────────────────────────────────

  // View satisfying a viewpoint with expose
  view 'Structural Parts' : GeneralView {
    satisfy 'structural overview';
    expose ViewShowcase::**;
    filter @SysML::PartUsage;
  }

  // ─── 7. Subviews (nested view composition) ────────────────────

  // Parent view with nested subviews
  view 'Composite View' : GeneralView {
    expose ViewShowcase::**;

    // Subview: shows only the control system internals
    view 'Control System Detail' : InterconnectionView {
      expose ControlSystem;
    }

    // Subview: shows only requirements
    view 'Requirements Summary' : GeneralView {
      expose ViewShowcase::**;
      filter @SysML::RequirementUsage;
    }
  }
}
