package TorchSystem {
    /**
    * Simple torch/flashlight system demonstrating SysML v2.0 sequence modeling
    * Shows interactions between components and step-by-step behavior
    */

    part def Torch {
        part battery : Battery;
        part switchButton : Switch;
        part ledBulb : LEDBulb;
        part reflector : Reflector;
        part housing : Housing;

        attribute isOn : Boolean = false;
        attribute batteryLevel : Real;
        attribute brightness : Real;

        // Sequence of operations when torch is turned on
        action turnOn {
            // Step 1: User presses switch
            first start;
            then action pressSwitch {
                in user : User;
                switchButton.pressed = true;
            }

            // Step 2: Switch sends signal to circuit
            then action activateCircuit {
                switchButton.signalSent = true;
            }

            // Step 3: Check battery level
            then action checkBattery {
                if (battery.charge > 0.1) {
                    battery.providing = true;
                } else {
                // Low battery - dim light or no light
                battery.providing = false;
            }
        }

        // Step 4: Power LED if battery OK
        then action powerLED {
            if (battery.providing) {
                ledBulb.powered = true;
                ledBulb.emitLight();
            }
        }

        // Step 5: Light reflects and exits
        then action produceLight {
            if (ledBulb.powered) {
                reflector.reflect(ledBulb.light);
                isOn = true;
                brightness = battery.charge * ledBulb.maxBrightness;
            }
        }

        then done;
    }

    // Sequence of operations when torch is turned off
    action turnOff {
        first start;
        then action releaseSwitch {
            in user : User;
            switchButton.pressed = false;
        }

        then action deactivateCircuit {
            switchButton.signalSent = false;
        }

        then action stopPowerToLED {
            battery.providing = false;
            ledBulb.powered = false;
        }

        then action stopLight {
            ledBulb.stopEmitting();
            reflector.noReflection();
            isOn = false;
            brightness = 0.0;
        }

        then done;
    }

    // Battery drain sequence (continuous while on)
    action drainBattery {
        first start;
        then action consumePower while (isOn) {
            battery.charge = battery.charge - 0.001; // Gradual drain
            if (battery.charge <= 0.0) {
                battery.charge = 0.0;
                // Auto turn off when battery depleted
                perform turnOff;
            }
        }
        then done;
    }

    state torchStates {
        state off {
        entry action { brightness = 0.0; }
    }
    state on {
        entry action {
            brightness = battery.charge * ledBulb.maxBrightness;
        }
        do action {
            perform drainBattery;
        }
    }
    state lowBattery {
        entry action {
            brightness = 0.1 * ledBulb.maxBrightness;
        }
    }

    transition off to on
    when switchButton.pressed and battery.charge > 0.1
    do perform turnOn;

    transition on to off
    when not switchButton.pressed
    do perform turnOff;

    transition on to lowBattery
    when battery.charge <= 0.1 and battery.charge > 0.0;

    transition lowBattery to off
    when battery.charge <= 0.0
    do perform turnOff;
}
}

part def Battery {
    attribute capacity : Real = 100.0; // mAh
    attribute charge : Real = 100.0;   // Current charge level (0-100)
    attribute voltage : Real = 3.7;    // Volts
    attribute providing : Boolean = false;

    constraint batteryConstraints {
        charge >= 0.0 and charge <= capacity
    }

    action discharge {
        in powerDraw : Real;
        charge = charge - powerDraw;
        if (charge < 0.0) charge = 0.0;
    }

    action recharge {
        in charger : Charger;
        charge = capacity; // Simplified - instant full charge
    }
}

part def Switch {
    attribute pressed : Boolean = false;
    attribute signalSent : Boolean = false;

    action pressSwitch {
        pressed = true;
        signalSent = true;
    }

    action releaseSwitch {
        pressed = false;
        signalSent = false;
    }
}

part def LEDBulb {
    attribute powered : Boolean = false;
    attribute maxBrightness : Real = 1000.0; // Lumens
    attribute currentBrightness : Real = 0.0;
    attribute light : LightBeam;

    action emitLight {
        if (powered) {
            currentBrightness = maxBrightness;
            light.intensity = currentBrightness;
            light.active = true;
        }
    }

    action stopEmitting {
        powered = false;
        currentBrightness = 0.0;
        light.active = false;
    }

    constraint ledConstraints {
        currentBrightness >= 0.0 and currentBrightness <= maxBrightness
    }
}

part def Reflector {
    attribute reflectance : Real = 0.85; // 85% efficiency
    attribute focused : Boolean = true;

    action reflect {
        in incomingLight : LightBeam;
        // Amplify and focus the light
        incomingLight.intensity = incomingLight.intensity * reflectance;
        incomingLight.focused = focused;
    }

    action noReflection {
        // No light to reflect
    }
}

part def Housing {
    attribute material : String = "Aluminum";
    attribute waterproof : Boolean = true;
    attribute dropResistant : Boolean = true;

    constraint durabilityConstraints {
        waterproof and dropResistant
    }
}

// Data types
part def LightBeam {
    attribute intensity : Real = 0.0;
    attribute color : String = "white";
    attribute focused : Boolean = false;
    attribute active : Boolean = false;
}

part def Charger {
    attribute voltage : Real = 5.0;
    attribute current : Real = 1.0;
    attribute connected : Boolean = false;
}

// Sequence diagram: Torch Turn-On Interaction
action def TorchTurnOnSequence {
    doc /* Sequence diagram showing the step-by-step process of turning on a torch */

    // Participants in the sequence
    in seqUser : User;
    in seqSwitch : Switch;
    in seqBattery : Battery;
    in seqLED : LEDBulb;
    in seqReflector : Reflector;

    first start;

    // Step 1: User presses switch
    then action userPressesSwitch {
        doc /* User presses the switch button */
        seqUser.press(seqSwitch);
    }

    // Step 2: Switch checks battery
    then action switchChecksBattery {
        doc /* Switch activates and checks battery charge */
        if (seqBattery.charge > 0.1) {
            seqSwitch.signalSent = true;
        }
    }

    // Step 3: LED receives power and emits light
    then action ledEmitsLight {
        doc /* LED receives power and emits light */
        if (seqSwitch.signalSent) {
            seqLED.emitLight();
        }
    }

    // Step 4: Reflector focuses and directs light
    then action reflectorFocusesLight {
        doc /* Reflector focuses the LED light */
        if (seqLED.powered) {
            seqReflector.reflect(seqLED.light);
        }
    }

    // Step 5: User receives illumination
    then action userReceivesLight {
        doc /* User receives focused light output */
        seqUser.hasIllumination = true;
    }

    then done;
}

// Sequence diagram: Battery Drain Process
action def BatteryDrainSequence {
    doc /* Shows continuous battery drain while torch is operating */

    in drainTorch : Torch;
    in drainBattery : Battery;
    in drainLED : LEDBulb;

    first start;

    then action continuousDrain while (drainTorch.isOn) {
        doc /* LED continuously drains battery power */

        // Sub-action: consume power
        action consumePower {
            drainLED.powered = true;
            drainBattery.discharge(0.001);
        }

        // Sub-action: check battery level
        action checkBatteryLevel {
            if (drainBattery.charge <= 0.0) {
                drainTorch.perform turnOff;
            } else if (drainBattery.charge <= 0.1) {
            drainLED.currentBrightness = 0.1 * drainLED.maxBrightness;
        }
    }
}

then done;
}

// Sequence diagram: Charging Process
action def ChargingSequence {
    doc /* Shows the torch charging interaction sequence */

    in chargingUser : User;
    in torchCharger : Charger;
    in chargingBattery : Battery;
    in chargingTorch : Torch;

    first start;

    // Step 1: User connects charger
    then action userConnectsCharger {
        doc /* User connects charger to torch */
        chargingUser.connects(torchCharger, chargingTorch);
    }

    // Step 2: Charger starts charging
    then action chargerStartsCharging {
        doc /* Charger begins charging process */
        torchCharger.connected = true;
    }

    // Step 3: Charging loop
    then action chargingLoop while (chargingBattery.charge < chargingBattery.capacity) {
        doc /* Continuous charging until battery full */

        action addCharge {
            chargingBattery.charge = chargingBattery.charge + 1.0;
            if (chargingBattery.charge > chargingBattery.capacity) {
                chargingBattery.charge = chargingBattery.capacity;
            }
        }
    }

    // Step 4: User disconnects charger
    then action userDisconnectsCharger {
        doc /* User disconnects charger when charging complete */
        chargingUser.disconnects(torchCharger);
        torchCharger.connected = false;
    }

    then done;
}

// Use cases demonstrating sequences
use case def UseTorch {
    actor user : User;
    subject torch : Torch;

    objective {
        doc /* User operates torch to provide illumination */
    }

    // Reference the sequence diagrams
    include TorchTurnOnSequence;
    include BatteryDrainSequence;
    include ChargingSequence;

    // Basic usage sequence
    action basicUsage {
        first start;

        // Step 1: User picks up torch
        then action pickUpTorch {
            user.holds(torch);
        }

        // Step 2: User presses switch - triggers turn-on sequence
        then action pressSwitchButton {
            user.press(torch.switchButton);
            // Perform the detailed turn-on sequence
            perform TorchTurnOnSequence(user, torch.switchButton, torch.battery, torch.ledBulb, torch.reflector);
            torch.perform turnOn;
        }

        // Step 3: User uses light for intended purpose
        then action useTorchLight while (torch.isOn and user.needsLight) {
            // Torch provides illumination
            user.hasIllumination = true;
            // Background battery drain sequence runs continuously
            perform BatteryDrainSequence(torch, torch.battery, torch.ledBulb);
        }

        // Step 4: User turns off torch
        then action releaseSwitchButton {
            user.release(torch.switchButton);
            torch.perform turnOff;
        }

        then done;
    }
}

use case def ChargeTorch {
    actor chargingUser : User;
    subject chargeTorch : Torch;
    subject torchCharger : Charger;

    objective {
        doc /* User charges the torch battery */
    }

    action chargingSequence {
        first start;

        then action connectChargerToTorch {
            chargingUser.connects(torchCharger, chargeTorch);
            torchCharger.connected = true;
            // Perform detailed charging sequence
            perform ChargingSequence(chargingUser, torchCharger, chargeTorch.battery, chargeTorch);
        }

        then action chargingProcess while (chargeTorch.battery.charge < chargeTorch.battery.capacity) {
            chargeTorch.battery.perform recharge(torchCharger);
        }

        then action disconnectChargerFromTorch {
            chargingUser.disconnects(torchCharger);
            torchCharger.connected = false;
        }

        then done;
    }
}

// Requirements with sequence constraints
requirement def OperationTimeReq {
    doc /* The torch shall operate for at least 8 hours on full charge */

    subject torch : Torch;

    require constraint {
        torch.battery.capacity >= 800.0 // mAh for 8+ hours
    }
}

requirement def ResponseTimeReq {
    doc /* The torch shall turn on within 100ms of switch press */

    subject torch : Torch;

    require constraint {
        // Time from switch press to light emission < 100ms
        torch.turnOn.duration <= 0.1 // seconds
    }
}

requirement def BatteryLifeReq {
    doc /* Battery shall maintain charge for 1 year in standby */

    subject battery : Battery;

    require constraint {
        battery.charge >= 0.95 * battery.capacity // after 1 year standby
    }
}

// Actor definition
actor def User {
    attribute hasIllumination : Boolean = false;
    attribute needsLight : Boolean = true;

    action holds {
        in item : Torch;
        // User physically holds the torch
    }

    action press {
        in switchButton : Switch;
        switchButton.perform pressSwitch;
    }

    action release {
        in switchButton : Switch;
        switchButton.perform releaseSwitch;
    }

    action connects {
        in charger : Charger;
        in torch : Torch;
        charger.connected = true;
    }

    action disconnects {
        in charger : Charger;
        charger.connected = false;
    }
}

// Example torch instances
part myTorch : Torch {
    :>> battery {
        :>> capacity = 900.0;
        :>> charge = 85.0;
        :>> voltage = 3.7;
    }

    :>> ledBulb {
        :>> maxBrightness = 1200.0;
    }

    :>> reflector {
        :>> reflectance = 0.90;
        :>> focused = true;
    }

    :>> housing {
        :>> material = "Aircraft Grade Aluminum";
        :>> waterproof = true;
        :>> dropResistant = true;
    }

    :>> isOn = false;
    :>> batteryLevel = 85.0;
    :>> brightness = 0.0;
}

// Emergency torch with different characteristics
part emergencyTorch : Torch {
    :>> battery {
        :>> capacity = 500.0;
        :>> charge = 100.0;
    }

    :>> ledBulb {
        :>> maxBrightness = 800.0; // Lower brightness, longer life
    }

    // Additional emergency features
    part strobeMode : StrobeMode;
    part sosSignal : SOSSignal;
}

part def StrobeMode {
    attribute strobeActive : Boolean = false;
    attribute frequency : Real = 2.0; // Hz

    action strobe {
        // Alternating on/off pattern for visibility
    }
}

part def SOSSignal {
    attribute sosActive : Boolean = false;

    action sendSOS {
        // Three short, three long, three short flashes
        // ... --- ...
    }

    // Activity diagram example for torch operation workflow
    action TorchOperationWorkflow {
        // 1. Start action
        1. Initialize torch system
        2. Check user input

        // Decision point
        if (user presses button) {
            3. Activate switch circuit
        } else {
        return to step 2
    }

    // Battery check loop
    while (battery charge > 0.1) {
        4. Power LED bulb
        5. Emit light through reflector
        6. Monitor battery level
    }

    // End actions
    if (battery charge <= 0.1) {
        7. Display low battery warning
        8. Shut down torch
    }

    // Flow to cleanup
    then cleanup_resources
    then end
}

// Emergency procedures activity
action EmergencyProcedures {
    // Start with torch check
    1. Verify torch functionality

    // Decision based on emergency type
    if (emergency_type == "signal") {
        2. Activate SOS mode
        then flash_pattern_sos
    } else if (emergency_type == "navigation") {
    3. Set maximum brightness
    then continuous_beam
} else {
4. Use standard operation
}

// Loop until emergency resolved
while (emergency_active) {
    5. Monitor battery continuously
    6. Adjust brightness as needed
}

// Recovery actions
7. Return to normal mode
then end
}
}
}
