package SmartHomeSystem {
    /*
    * Smart home system demonstrating IoT and automation concepts in SysML v2.0
    * Shows interconnected devices, sensors, and automated behaviors
    */
    part def SmartHome {
        part lightingSystem : LightingSystem;
        part securitySystem : SecuritySystem;
        part climateSystem : ClimateControl;
        part entertainmentSystem : Entertainment;
        part energySystem : EnergyManagement;
        part networkSystem : HomeNetwork;
        attribute homeMode : HomeMode;
        attribute occupancyStatus : Boolean;
        attribute emergencyStatus : Boolean;
        state homeStates {
            state vacant;
            state occupied;
            state sleep;
            state away;
            state emergency;

            transition first vacant then occupied;
            transition first occupied then sleep;
            transition first occupied then away;
            transition first any then emergency;
        }
    }
    part def LightingSystem {
        part smartBulbs : SmartBulb[*];
        part dimmers : Dimmer[*];
        part motionSensors : MotionSensor[*];
        part lightSwitches : SmartSwitch[*];
        attribute totalPowerConsumption : PowerValue;
        attribute automationEnabled : Boolean;
        action def AutomaticLighting {
            first start;

            then
            action readSensors {
                out occupied : Boolean;
                out ambientLight : Real;
            }

            then
            action assessRoom;
            then
            action selectLightingScene;
            then
            action adjustBrightness;
            then
            action recordEnergyUsage;
            then done;
        }
    }
    part def SecuritySystem {
        part cameras : SecurityCamera[*];
        part doorLocks : SmartLock[*];
        part windowSensors : WindowSensor[*];
        part alarmSiren : AlarmSiren;
        part securityPanel : SecurityPanel;
        attribute systemArmed : Boolean;
        attribute intrusionDetected : Boolean;
        state securityStates {
            state disarmed;
            state armed_home;
            state armed_away;
            state alarm;

            transition first disarmed then armed_home;
            transition first disarmed then armed_away;
            transition first armed_home then alarm;
            transition first armed_away then alarm;
        }
        action def EmergencyContainment {
            // Rapidly secure entry points, trigger siren, and notify authorities
            }
    }
    part def ClimateControl {
        part thermostat : SmartThermostat;
        part hvacSystem : HVACSystem;
        part temperatureSensors : TempSensor[*];
        part humiditySensors : HumiditySensor[*];
        part smartVents : SmartVent[*];
        attribute targetTemperature : TemperatureValue;
        attribute currentTemperature : TemperatureValue;
        attribute humidity : Real;
        attribute energyEfficiencyMode : Boolean;
        constraint comfortRange {
            currentTemperature >= 20.0 and
            currentTemperature <= 25.0
            }
    }
    part def Entertainment {
        part smartTV : SmartTV[*];
        part speakers : SmartSpeaker[*];
        part streamingDevices : StreamingDevice[*];
        part gamingConsoles : GamingConsole[*];
        attribute currentlyPlaying : String;
        attribute volume : Real;
        attribute multiRoomAudio : Boolean;
    }
    part def EnergyManagement {
        part smartMeter : SmartMeter;
        part solarPanels : SolarPanel[*];
        part batteryStorage : HomeBattery;
        part smartOutlets : SmartOutlet[*];
        attribute totalConsumption : EnergyValue;
        attribute solarGeneration : EnergyValue;
        attribute gridExport : EnergyValue;
        attribute batteryLevel : Real;
        constraint energyBalance {
            totalConsumption <= solarGeneration + gridImport + batteryDischarge
            }
    }
    part def HomeNetwork {
        part router : WiFiRouter;
        part accessPoints : WiFiAccessPoint[*];
        part ethernetSwitch : EthernetSwitch;
        part devices : ConnectedDevice[*];
        attribute networkSpeed : Real;
        attribute connectedDeviceCount : Integer;
        attribute internetConnected : Boolean;
    }

    // Device definitions
    part def SmartBulb {
        attribute brightness : Real;
        attribute color : RGBColor;
        attribute powerConsumption : PowerValue;
        attribute connected : Boolean;
        constraint brightnessRange {
            brightness >= 0.0 and brightness <= 1.0
            }
    }
    part def Dimmer {
        attribute level : Real;
        attribute loadConnected : Boolean;
        constraint dimmerRange {
            level >= 0.0 and level <= 1.0
            }
    }
    part def MotionSensor {
        attribute motionDetected : Boolean;
        attribute sensitivity : Real;
        attribute batteryLevel : Real;
        attribute lastMotionTime : TimeValue;
    }
    part def SmartSwitch {
        attribute switchState : Boolean;
        attribute timerEnabled : Boolean;
        attribute scheduleActive : Boolean;
    }
    part def SecurityCamera {
        attribute recording : Boolean;
        attribute nightVision : Boolean;
        attribute motionTracking : Boolean;
        attribute resolution : String;
        attribute storageCapacity : Real;
    }
    part def SmartLock {
        attribute locked : Boolean;
        attribute batteryLevel : Real;
        attribute accessCode : String[*];
        attribute autoLock : Boolean;
        state lockStates {
            state locked;
            state unlocked;
            state locking;
            state unlocking;

            transition first unlocked then locking;
            transition first locking then locked;
            transition first locked then unlocking;
            transition first unlocking then unlocked;
        }
    }
    part def WindowSensor {
        attribute windowOpen : Boolean;
        attribute batteryLevel : Real;
        attribute tamperDetected : Boolean;
    }
    part def SmartThermostat {
        attribute currentTemp : TemperatureValue;
        attribute targetTemp : TemperatureValue;
        attribute mode : ThermostatMode;
        attribute scheduleEnabled : Boolean;
        state thermostatStates {
            state off;
            state heating;
            state cooling;
            state auto;

            transition first off then heating;
            transition first off then cooling;
            transition first heating then cooling;
        }
    }
    part def HVACSystem {
        part furnace : Furnace;
        part airConditioner : AirConditioner;
        part ventilationFan : Fan;
        attribute systemRunning : Boolean;
        attribute filterStatus : String;
        attribute maintenanceRequired : Boolean;
    }

    // Enumeration types
    enum def HomeMode {
        home;
        away;
        sleep;
        vacation;
        party;
    }
    enum def ThermostatMode {
        off;
        heat;
        cool;
        auto;
        eco;
    }

    // Data types
    attribute def RGBColor {
        attribute red : Integer;
        attribute green : Integer;
        attribute blue : Integer;
    }

    // Requirements
    requirement def EnergyEfficiencyReq {
        doc /* The smart home shall optimize energy consumption automatically */

        subject home : SmartHome;

        require constraint {
            home.energySystem.solarGeneration >= 0.6 * home.energySystem.totalConsumption
        }
    }
    requirement def SecurityReq {
        doc /* The security system shall detect and report intrusions within 30 seconds */

        subject security : SecuritySystem;

        require constraint {
            security.intrusionDetected implies
            (security.alarmSiren.active and security.securityPanel.notificationSent)
        }
    }
    requirement def ComfortReq {
        doc /* The home shall maintain comfortable temperature and lighting automatically */

        subject home : SmartHome;

        require constraint {
            home.climateSystem.currentTemperature >= 20.0 and
            home.climateSystem.currentTemperature <= 25.0
        }
    }
    requirement def AdaptiveLightingReq {
        doc /* Occupied spaces shall receive adaptive lighting adjustments within 2 seconds */

        subject lighting : LightingSystem;

        require constraint {
            lighting.automationEnabled
        }
    }
    requirement def EmergencyLockdownReq {
        doc /* Upon intrusion detection the system shall lock entry points and raise an alarm */

        subject security : SecuritySystem;

        require constraint {
            security.intrusionDetected implies security.alarmSiren.active
        }
    }

    // Requirement satisfaction relationships
    // Requirement satisfaction relationships
    // assert satisfy AdaptiveLightingReq by LightingSystem::AutomaticLighting;
    // assert satisfy EmergencyLockdownReq by SecuritySystem::EmergencyContainment;

    // Use cases
    use case def AutomateHome {
        actor homeowner : Homeowner;
        subject smartHome : SmartHome;
        objective {
            doc /* Automatically manage home systems for comfort, security, and efficiency */
        }
    }
    use case def MonitorSecurity {
        actor securityService : SecurityService;
        subject securitySystem : SecuritySystem;
        objective {
            doc /* Monitor home security and respond to alerts */
        }
    }
    use case def ManageEnergy {
        actor utilityCompany : UtilityCompany;
        subject energySystem : EnergyManagement;
        objective {
            doc /* Optimize energy usage and grid integration */
        }
    }

    // Actor definitions
    part def Homeowner {
        attribute preferences : String[*];
        attribute mobileApp : String;
    }
    part def SecurityService {
        attribute responseTime : TimeValue;
        attribute serviceLevel : String;
    }
    part def UtilityCompany {
        attribute gridCapacity : PowerValue;
        attribute timeOfUseRates : Real[*];
    }

    // Supporting component definitions
    part def AlarmSiren {
        attribute active : Boolean;
        attribute volume : Real;
        attribute batteryBackup : Boolean;
    }
    part def SecurityPanel {
        attribute displayStatus : String;
        attribute notificationSent : Boolean;
        attribute userCode : String;
    }
    part def TempSensor {
        attribute temperature : TemperatureValue;
        attribute accuracy : Real;
        attribute batteryLevel : Real;
    }
    part def HumiditySensor {
        attribute humidity : Real;
        attribute calibrated : Boolean;
    }
    part def SmartVent {
        attribute openPercentage : Real;
        attribute airflowRate : Real;
        attribute motorized : Boolean;
    }
    part def SmartTV {
        attribute screenSize : LengthValue;
        attribute resolution : String;
        attribute smartFeatures : String[*];
        attribute powerConsumption : PowerValue;
    }
    part def SmartSpeaker {
        attribute voiceControlEnabled : Boolean;
        attribute currentVolume : Real;
        attribute connectedServices : String[*];
    }
    part def StreamingDevice {
        attribute platform : String;
        attribute subscriptions : String[*];
        attribute videoQuality : String;
    }
    part def GamingConsole {
        attribute model : String;
        attribute storageCapacity : Real;
        attribute onlineConnected : Boolean;
    }
    part def SmartMeter {
        attribute currentUsage : PowerValue;
        attribute monthlyUsage : EnergyValue;
        attribute realTimeData : Boolean;
    }
    part def SolarPanel {
        attribute ratedPower : PowerValue;
        attribute efficiency : Real;
        attribute orientation : String;
        attribute active : Boolean;
    }
    part def HomeBattery {
        attribute capacity : EnergyValue;
        attribute chargeLevel : Real;
        attribute charging : Boolean;
        attribute discharging : Boolean;
    }
    part def SmartOutlet {
        attribute powerState : Boolean;
        attribute currentLoad : PowerValue;
        attribute scheduling : Boolean;
        attribute usageMonitoring : Boolean;
    }
    part def WiFiRouter {
        attribute ssid : String;
        attribute bandwidth : Real;
        attribute connectedDevices : Integer;
        attribute securityProtocol : String;
    }
    part def WiFiAccessPoint {
        attribute coverage : AreaValue;
        attribute signalStrength : Real;
        attribute meshEnabled : Boolean;
    }
    part def EthernetSwitch {
        attribute portCount : Integer;
        attribute speed : Real;
        attribute poeEnabled : Boolean;
    }
    part def ConnectedDevice {
        attribute deviceType : String;
        attribute ipAddress : String;
        attribute macAddress : String;
        attribute lastSeen : TimeValue;
    }
    part def Furnace {
        attribute fuelType : String;
        attribute efficiency : Real;
        attribute heating : Boolean;
    }
    part def AirConditioner {
        attribute coolingCapacity : Real;
        attribute efficiency : Real;
        attribute cooling : Boolean;
    }
    part def Fan {
        attribute speed : Real;
        attribute direction : String;
        attribute running : Boolean;
    }

    // Example smart home instance
    part mySmartHome : SmartHome {
        :>> homeMode = HomeMode::home;
        :>> occupancyStatus = true;
        :>> emergencyStatus = false;

        :>> lightingSystem {
            :>> automationEnabled = true;
            :>> totalPowerConsumption = 150.0 [W];
        }

        :>> securitySystem {
            :>> systemArmed = false;
            :>> intrusionDetected = false;
        }

        :>> climateSystem {
            :>> targetTemperature = 22.0;
            :>> currentTemperature = 21.5;
            :>> humidity = 45.0;
            :>> energyEfficiencyMode = true;
        }

        :>> energySystem {
            :>> batteryLevel = 0.85;
            :>> totalConsumption = 2500.0 [Wh];
            :>> solarGeneration = 1800.0 [Wh];
        }
    }
}
