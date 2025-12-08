package CameraStateMachine {

    // Camera operational states
    state def CameraState;

    state cameraPowerStates : CameraState {
        entry; then off;

        state off : CameraState;

        transition off_to_initializing
        first off
        accept PowerOnEvent
        then initializing;

        state initializing : CameraState {
            entry / initializeSensors();
        }

        transition initializing_to_ready
        first initializing
        then ready;

        state ready : CameraState {
            entry / displayReady();

            // Nested states within ready
            state idle : CameraState;

            state focusing : CameraState {
                entry / activateAutofocus();
                do / continuousFocus();
            }

            state capturing : CameraState {
                entry / openShutter();
                do / captureImage();
                exit / closeShutter();
            }

            state processing : CameraState {
                entry / processImageData();
            }

            state reviewing : CameraState {
                entry / displayImage();
            }

            // Transitions within ready state
            transition idle_to_focusing
            first idle
            accept HalfPressShutterEvent
            then focusing;

            transition focusing_to_capturing
            first focusing
            accept FullPressShutterEvent
            then capturing;

            transition capturing_to_processing
            first capturing
            then processing;

            transition processing_to_reviewing
            first processing
            then reviewing;

            transition reviewing_to_idle
            first reviewing
            accept ConfirmEvent
            then idle;

            transition focusing_to_idle
            first focusing
            accept ReleaseShutterEvent
            then idle;
        }

        state lowBattery : CameraState {
            entry / displayLowBatteryWarning();
        }

        transition ready_to_lowBattery
        first ready
        accept LowBatteryEvent
        then lowBattery;

        transition lowBattery_to_ready
        first lowBattery
        accept BatteryChargedEvent
        then ready;

        transition ready_to_off
        first ready
        accept PowerOffEvent
        then off;

        transition lowBattery_to_off
        first lowBattery
        accept PowerOffEvent
        then off;
    }

    // Events
    event def PowerOnEvent;
    event def PowerOffEvent;
    event def HalfPressShutterEvent;
    event def FullPressShutterEvent;
    event def ReleaseShutterEvent;
    event def ConfirmEvent;
    event def LowBatteryEvent;
    event def BatteryChargedEvent;

    // Actions
    action def initializeSensors;
    action def displayReady;
    action def activateAutofocus;
    action def continuousFocus;
    action def openShutter;
    action def captureImage;
    action def closeShutter;
    action def processImageData;
    action def displayImage;
    action def displayLowBatteryWarning;
}
