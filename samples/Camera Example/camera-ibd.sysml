package CameraTestIBD {
    import CameraTestBDD::*;

    part def CameraSystemAssembly {
        part camera : CameraSystem {
            port powerIn {
                :>> voltage = 7.4;
                :>> current = 2.0;
            }

            part optics {
                :>> focalLengthMm = 35.0;
                :>> aperture = 1.8;
            }

            part imaging {
                :>> pixelCount = 24000000;
                :>> sensorType = "CMOS";
            }

            part controller {
                :>> firmwareVersion = "v2.1";
            }

            part power {
                :>> capacityMah = 2000;
                :>> healthPercent = 88.0;
            }
        }

        part gripBattery : PowerModule {
            :>> capacityMah = 1500;
            :>> healthPercent = 95.0;
        }

        //////////////////////////////////////////////////////////////////////
        // Connectors rendered on the IBD canvas
        //////////////////////////////////////////////////////////////////////

        connection powerFeed {
            end primary : gripBattery.supply;
            end main : camera.power.supply;
        }

        connection lensToSensor {
            end lens : camera.optics.outgoingLight;
            end sensor : camera.imaging.intakeLight;
        }

        connection sensorPixels {
            end source : camera.imaging.pixelBus;
            end sink : camera.controller.commandBus;
        }

        connection outputLink {
            end controller : camera.controller.commandBus;
            end media : camera.mediaOut;
        }
    }

    part benchRig : CameraSystemAssembly;
}
