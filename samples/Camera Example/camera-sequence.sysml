package CameraTestSequence {
    private import CameraTestBDD::*;

    part def CaptureSequence {
        part photographer;
        part camera : CameraSystem;
        part storage;

        flow wakeRequest from photographer to camera;
        flow wakeAck from camera to photographer;
        flow focusCommand from photographer to camera;
        flow focusLocked from camera to photographer;
        flow shutterCommand from photographer to camera;
        flow frameBuffered from camera to storage;
        flow persistAck from storage to photographer;

        occurrence wakeup;
        occurrence focusPhase;
        occurrence capturePhase;
    }

    part captureHappyPath : CaptureSequence;
}
