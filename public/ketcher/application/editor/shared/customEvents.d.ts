import { Vec2 } from "../../../domain/entities";
import { AttachmentPointName } from "../../../domain/types";
export declare const MonomerCreationAttachmentPointClickEvent = "MonomerCreationAttachmentPointClick";
export declare type AttachmentPointClickData = {
    attachmentPointName: AttachmentPointName;
    position: Vec2;
};
