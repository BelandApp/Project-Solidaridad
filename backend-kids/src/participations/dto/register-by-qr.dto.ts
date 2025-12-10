import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterByQrDto {
    /*
     * The "qrCode" usually contains the data.
     * If the app scans the QR, it might just send the raw string content of the QR.
     * The logic in service should parse it or look it up.
     * Based on my implementation of ChildrenService, QR contains: `JSON.stringify({ id: ..., name: ... })`
     * Or the user might interpret "qrCode" as just the Base64 image? No, that's for display.
     * When scanning, the scanner decodes the Base64 image back to the text "{"id":"...", ...}"
     * So the backend receives the string content of the QR.
     * Wait, the request says "qrCode (string) - base64 generado automáticamente".
     * And endpoint: "POST /participations/register-by-qr se envía { eventId: string, childId: string }".
     * WAIT. The prompt description says:
     * "POST /participations/register-by-qr -> usa qrCode + eventId" (in point 3)
     * BUT in point 1 it says: "POST /participations/register-by-qr Se envía { eventId: string, childId: string }"
     * This is contradictory. Point 3 says "usa qrCode + eventId".
     * If I look at the Requirements again:
     * "Endpoint para registrar participación por QR escaneado: POST /participations/register-by-qr Se envía { eventId: string, childId: string }"
     * If it sends childId, then the "scanning" happened on the client side, and the client extracted the childId from the QR.
     * IF so, it's the exact same as the normal endpoint, just a different route?
     * HOWEVER, usually a "register by QR" endpoint might accept the payload of the QR directly if it's signed or encrypted.
     * Given the ambiguity, I will support "qrContent" OR "childId".
     * But let's look at the specific instruction in "3. ENDPOINTS REQUERIDOS":
     * "POST /participations/register-by-qr → usa qrCode + eventId"
     * So I should probably expect `{ qrCode: string, eventId: string }`.
     * And the logic will extract childId from `qrCode` string.
     */
    @ApiProperty({ example: '{"id":"uuid..."}', description: 'Content scanned from the QR code' })
    @IsString()
    @IsNotEmpty()
    qrContent: string;

    @ApiProperty({ description: 'ID of the event' })
    @IsUUID()
    @IsNotEmpty()
    eventId: string;
}
