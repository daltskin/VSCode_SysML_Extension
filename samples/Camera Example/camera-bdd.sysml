package CameraTestBDD {
    import PictureTaking::*;

    part def CameraSystem {
        attribute resolution : Resolution;
        attribute storageCapacity : Integer;
        attribute burstRateFps : Real;
        port powerIn : PowerPort;
        port mediaOut : DataPort;

        part optics : LensAssembly;
        part imaging : ImageSensor;
        part controller : CaptureController;
        part power : PowerModule;
    }

    part def LensAssembly {
        attribute focalLengthMm : Real;
        attribute aperture : Real;
        port incomingLight : OpticalPort;
        port outgoingLight : OpticalPort;
    }

    part def ImageSensor {
        attribute pixelCount : Integer;
        attribute sensorType : String;
        port pixelBus : DataPort;
        port intakeLight : OpticalPort;
    }

    part def CaptureController {
        attribute firmwareVersion : String;
        port commandBus : DataPort;
        port shutterSignal : ControlPort;
    }

    part def PowerModule {
        attribute capacityMah : Integer;
        attribute healthPercent : Real;
        port supply : PowerPort;
    }

    port def PowerPort {
        attribute voltage : Real;
        attribute current : Real;
    }

    port def DataPort {
        attribute bandwidthMbps : Real;
        flow property payload : String direction inout;
    }

    port def OpticalPort {
        attribute diameterMm : Real;
    }

    port def ControlPort {
        attribute signalType : String;
    }

    requirement def ProvideContinuousCapture {
        id = "REQ-CAM-001";
        text = "Camera shall capture at least 10 frames per second for 5 seconds.";
    }

    requirement def ProtectSensor {
        id = "REQ-CAM-002";
        text = "Camera shall prevent exposure when lens cover is closed.";
    }

    part def CameraKit {
        part camera : CameraSystem;
        part spareLens : LensAssembly;
        part battery : PowerModule;
    }
}
