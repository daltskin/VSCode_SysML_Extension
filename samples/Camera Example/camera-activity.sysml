package CameraTestActivity {
    public import CameraTestBDD::*;
    public import ScalarValues::*;
    public import RealFunctions::*;

    action def PrepareCamera {
        out powered : Boolean;
        out opticsReady : Boolean;

        action wakePower {
            out batteryLevel : Real;
        }

        then decision checkBattery {
            if (batteryLevel >= 20.0) {
                then action enableRegulators {
                    out regulatorsReady : Boolean;
                }
            } else {
            then action reportLowBattery {
                out powered = false;
                out opticsReady = false;
            }
        }
    }

    then action initializeOptics {
        in regulatorsReady : Boolean;
        out focusCalibrated : Boolean;
    }

    then action confirmReady {
        in focusCalibrated : Boolean;
        out powered = true;
        out opticsReady = focusCalibrated;
    }
}

action def AcquireFrame {
    in opticsReady : Boolean;
    in exposureTarget : Real;
    out frameData : String;

    action meterScene {
        in lightTarget : Real;
        out measuredLux : Real;
    }

    then action adjustSensor {
        in measuredLux : Real;
        in desiredExposure : Real;
        out integrationTime : Real;
    }

    then action triggerShutter {
        in integrationTime : Real;
        out photonCharge : Real;
    }

    then action readSensor {
        in photonCharge : Real;
        out frameData : String;
    }
}

action def PostProcessBurst {
    in frameData : String;
    in burstCount : Integer;
    out curatedSet : Integer;

    action evaluateSharpness {
        in rawFrame : String;
        out score : Real;
    }

    then decision acceptFrame {
        if (score >= 0.8) {
            then action enqueueFrame {
                in framePayload : String;
                in nextIndex : Integer;
                out updatedCount : Integer;
            }
        } else {
        then action discardFrame {
            in reason : String;
        }
    }
}

then action finalizeSet {
    in updatedCount : Integer;
    out curatedSet = updatedCount;
}
}

action captureWorkflow {
    first start;

    then action declareContext {
        out desiredExposure : Real = 0.12;
        out burstTarget : Integer = 1;
    }

    then prepare : PrepareCamera {
        out powered = cameraReady;
        out opticsReady = opticsAligned;
    }

    then decision readyCheck {
        if (cameraReady && opticsAligned) {
            then acquire : AcquireFrame {
                in opticsReady = opticsAligned;
                in exposureTarget = desiredExposure;
                out frameData = currentFrame;
            }

            then action bufferFrame {
                in payload = currentFrame;
                out storedFrame = currentFrame;
            }
        } else {
        then action abortSequence {
            out logMessage = "Camera not ready";
        }
    }
}

then post : PostProcessBurst {
    in frameData = currentFrame;
    in burstCount = burstTarget;
    out curatedSet = acceptedFrames;
}

then action updateStorage {
    in acceptedFrames : Integer;
    out storageUsage : Real;
}

then done;
}
}
