package CameraTestSequence {
    import CameraTestBDD::*;

    interaction def CaptureSequence {
        participant photographer;
        participant camera : CameraSystem;
        participant storage;

        message wakeRequest : SendMessage from photographer to camera {
            payload command : String;
        }

        message wakeAck : SendMessage from camera to photographer {
            payload status : String;
        }

        message focusCommand : SendMessage from photographer to camera;
        message focusLocked : SendMessage from camera to photographer;
        message shutterCommand : SendMessage from photographer to camera;
        message frameBuffered : SendMessage from camera to storage;
        message persistAck : SendMessage from storage to photographer;

        occurrence wakeup;
        occurrence focusPhase;
        occurrence capturePhase;
    }

    interaction captureHappyPath {
        interaction scenario : CaptureSequence;
    }
}
