package SpaceMissionSystem {
    /**
     * Space mission example demonstrating complex SysML v2.0 system modeling
     * including hierarchical decomposition, state machines, and requirements
     */

    // Mission-level system
    part def SpaceMission {
        part spacecraft : Spacecraft;
        part groundStation : GroundStation;
        part missionControl : MissionControl;

        attribute missionDuration : TimeValue;
        attribute missionObjectives : String[*];
        attribute currentPhase : MissionPhase;

        state missionPhases {
            state preparation;
            state launch;
            state transit;
            state operations;
            state return;
            state complete;

            transition preparation to launch when launchReady;
            transition launch to transit when orbitAchieved;
            transition transit to operations when destinationReached;
            transition operations to return when objectivesComplete;
            transition return to complete when spacecraftRecovered;
        }
    }

    part def Spacecraft {
        part propulsionSystem : PropulsionSystem;
        part powerSystem : PowerSystem;
        part communicationSystem : CommSystem;
        part navigationSystem : NavSystem;
        part lifeSupportSystem : LifeSupport;
        part sciencePayload : SciencePackage;

        attribute mass : MassValue;
        attribute fuelLevel : Real;
        attribute altitude : LengthValue;
        attribute velocity : SpeedValue;

        constraint massConstraint {
            mass <= 10000.0 [kg]
        }
    }

    part def PropulsionSystem {
        part mainEngine : RocketEngine;
        part thrusters : Thruster[8];
        part fuelTank : FuelTank;

        attribute thrust : ForceValue;
        attribute specificImpulse : Real;

        state propulsionStates {
            state idle;
            state firing;
            state maneuvering;

            transition idle to firing when ignitionCommand;
            transition firing to idle when shutdownCommand;
            transition idle to maneuvering when maneuverCommand;
        }
    }

    part def PowerSystem {
        part solarPanels : SolarPanel[4];
        part batteries : Battery[6];
        part powerController : PowerController;

        attribute totalPower : PowerValue;
        attribute batteryCharge : Real;

        constraint powerBalance {
            totalPower >= systemLoad
        }
    }

    part def CommSystem {
        part highGainAntenna : Antenna;
        part lowGainAntenna : Antenna;
        part transmitter : Transmitter;
        part receiver : Receiver;

        attribute dataRate : Real;
        attribute signalStrength : Real;

        state commStates {
            state standby;
            state transmitting;
            state receiving;

            transition standby to transmitting when transmitCommand;
            transition standby to receiving when receiveCommand;
        }
    }

    part def NavSystem {
        part starTracker : StarTracker;
        part imu : IMU;
        part gps : SpaceGPS;

        attribute position : Position3D;
        attribute orientation : Orientation3D;
        attribute navigationAccuracy : LengthValue;
    }

    part def LifeSupport {
        part oxygenGenerator : O2Generator;
        part carbonDioxideRemover : CO2Scrubber;
        part waterRecycler : WaterRecycler;
        part temperatureControl : ThermalControl;

        attribute oxygenLevel : Real;
        attribute co2Level : Real;
        attribute temperature : TemperatureValue;

        constraint lifeSafetyLimits {
            oxygenLevel >= 0.18 and
            co2Level <= 0.005 and
            temperature >= 18.0 [°C] and temperature <= 24.0 [°C]
        }
    }

    part def SciencePackage {
        part cameras : Camera[3];
        part spectrometer : Spectrometer;
        part magnetometer : Magnetometer;
        part dataStorage : DataStorage;

        attribute scienceDataCollected : Real;
        attribute storageCapacity : Real;

        constraint dataConstraint {
            scienceDataCollected <= storageCapacity
        }
    }

    // Ground systems
    part def GroundStation {
        part dish : GroundAntenna;
        part computers : GroundComputer[*];
        part displays : Display[*];

        attribute operationalStatus : Boolean;
        attribute connectionQuality : Real;
    }

    part def MissionControl {
        part flightDirector : FlightDirector;
        part engineers : Engineer[*];
        part scientists : Scientist[*];

        attribute missionStatus : String;
        attribute goNoGoStatus : Boolean;
    }

    // Supporting definitions
    enum def MissionPhase {
        preparation;
        launch;
        transit;
        operations;
        return;
        complete;
    }

    // Data structures
    attribute def Position3D {
        attribute x : LengthValue;
        attribute y : LengthValue;
        attribute z : LengthValue;
    }

    attribute def Orientation3D {
        attribute roll : AngleValue;
        attribute pitch : AngleValue;
        attribute yaw : AngleValue;
    }

    // Requirements
    requirement def MissionSuccessReq {
        doc /* The mission shall successfully complete all primary objectives */

        subject mission : SpaceMission;

        require constraint {
            mission.currentPhase == MissionPhase::complete and
            mission.spacecraft.sciencePayload.scienceDataCollected >= 1000.0
        }
    }

    requirement def CrewSafetyReq {
        doc /* The spacecraft shall maintain safe life support conditions */

        subject spacecraft : Spacecraft;

        require constraint {
            spacecraft.lifeSupportSystem.oxygenLevel >= 0.18 and
            spacecraft.lifeSupportSystem.co2Level <= 0.005
        }
    }

    requirement def CommunicationReq {
        doc /* The spacecraft shall maintain communication with Earth */

        subject spacecraft : Spacecraft;

        require constraint {
            spacecraft.communicationSystem.signalStrength >= -120.0
        }
    }

    // Use cases
    use case def ConductMission {
        actor missionTeam : MissionTeam;
        subject mission : SpaceMission;

        objective {
            doc /* Successfully execute the space mission from launch to completion */
        }
    }

    use case def EmergencyResponse {
        actor flightDirector : FlightDirector;
        subject spacecraft : Spacecraft;

        objective {
            doc /* Respond to spacecraft emergencies and ensure crew safety */
        }
    }

    // Actor definitions
    actor def MissionTeam {
        attribute teamSize : Integer;
        attribute experience : Real;
    }

    actor def FlightDirector {
        attribute certification : String;
        attribute yearsExperience : Integer;
    }

    actor def Engineer {
        attribute specialty : String;
        attribute clearanceLevel : String;
    }

    actor def Scientist {
        attribute field : String;
        attribute publicationsCount : Integer;
    }

    // Component definitions (simplified)
    part def RocketEngine {
        attribute thrust : ForceValue;
        attribute fuelType : String;
    }

    part def Thruster {
        attribute thrust : ForceValue;
        attribute orientationControl : Boolean;
    }

    part def FuelTank {
        attribute capacity : VolumeValue;
        attribute currentLevel : Real;
    }

    part def SolarPanel {
        attribute area : AreaValue;
        attribute efficiency : Real;
        attribute powerOutput : PowerValue;
    }

    part def Battery {
        attribute capacity : EnergyValue;
        attribute voltage : ElectricPotentialValue;
        attribute chargeLevel : Real;
    }

    part def PowerController {
        attribute maxPower : PowerValue;
        attribute efficiency : Real;
    }

    part def Antenna {
        attribute gain : Real;
        attribute frequency : FrequencyValue;
        attribute beamwidth : AngleValue;
    }

    part def Transmitter {
        attribute power : PowerValue;
        attribute frequency : FrequencyValue;
    }

    part def Receiver {
        attribute sensitivity : Real;
        attribute bandwidth : FrequencyValue;
    }

    part def StarTracker {
        attribute accuracy : AngleValue;
        attribute fieldOfView : AngleValue;
    }

    part def IMU {
        attribute gyroAccuracy : Real;
        attribute accelAccuracy : Real;
    }

    part def SpaceGPS {
        attribute accuracy : LengthValue;
        attribute updateRate : FrequencyValue;
    }

    // Example mission instance
    part marsMission : SpaceMission {
        :>> missionDuration = 365.0 [day];
        :>> missionObjectives = ["Mars surface exploration", "Sample collection", "Atmospheric analysis"];
        :>> currentPhase = MissionPhase::preparation;

        :>> spacecraft {
            :>> mass = 8500.0 [kg];
            :>> fuelLevel = 0.95;
            :>> altitude = 0.0 [km];
        }
    }
}
