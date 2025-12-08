package Scenario_1o {
  item def VehicleStart;
  item def EngineStatus;
  action startVehicle1 {
    event occurrence doorClosed;
    event occurrence driverReady;
    first doorClosed then driverReady;
    first driverReady then turnVehicleOn;
    action turnVehicleOn send vs via source {
      in vs : VehicleStart;
      in source default self;
    }
    action trigger1 accept vs : VehicleStart;
    flow of VehicleStart from trigger1.vs to startEngine.vs;
    action startEngine {
      in item vs : VehicleStart;
      out item es : EngineStatus;
    }
    flow of EngineStatus from startEngine.es to sendStatus.es;
    action sendStatus send es via source {
      in es : EngineStatus;
      in source default self;
    }
    action trigger2 accept es : EngineStatus;
    message of VehicleStart from turnVehicleOn to trigger1;
    message of es : EngineStatus from sendStatus to trigger2;
  }
  part def Driver {
    port p1;
    port p2;
  }
  part def Vehicle {
    port p1;
  }
  part part0 {
    perform action startVehicle :> startVehicle1 {
      action :>> turnVehicleOn send vs via source {
        in :>> source = driver.p1;
      }
      action :>> trigger1 accept vs : VehicleStart via vehicle.p1;
      action :>> sendStatus send es via source {
        in es : EngineStatus;
        in :>> source = vehicle.p1;
      }
      action :>> trigger2 accept es : EngineStatus via vehicle.p1;
    }
    part driver : Driver {
      perform startVehicle.turnVehicleOn;
      perform startVehicle.trigger2;
      event startVehicle.driverReady;
    }
    part vehicle : Vehicle {
      perform startVehicle.trigger1;
      perform startVehicle.startEngine;
      perform startVehicle.sendStatus;
      event startVehicle.doorClosed;
    }
    interface driver.p1 to vehicle.p1;
    interface driver.p2 to vehicle.p1;
  }
}
