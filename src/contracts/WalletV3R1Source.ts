import { Address, Cell } from "..";
import { Maybe } from "../types";
import { ContractSource } from "./ContractSource";
import { calculateAdress } from "./utils/calculateAdress";

export class WalletV3R1Source implements ContractSource {

    static async create(opts: { publicKey: Buffer, workchain: number, walletId?: Maybe<number> }) {

        // Resolve parameters
        let publicKey = opts.publicKey;
        let workchain = opts.workchain;
        let walletId: number;
        if (opts.walletId !== null && opts.walletId !== undefined) {
            walletId = opts.walletId;
        } else {
            walletId = 698983191 + workchain;
        }


        // Build initial code and data
        let initialCode = Cell.fromBoc('B5EE9C724101010100620000C0FF0020DD2082014C97BA9730ED44D0D70B1FE0A4F2608308D71820D31FD31FD31FF82313BBF263ED44D0D31FD31FD3FFD15132BAF2A15144BAF2A204F901541055F910F2A3F8009320D74A96D307D402FB00E8D101A4C8CB1FCB1FCBFFC9ED543FBE6EE0')[0];
        let initialData = new Cell();
        initialData.bits.writeUint(0, 32);
        initialData.bits.writeUint(walletId, 32);
        initialData.bits.writeBuffer(publicKey);

        // Calculate address
        let address = await calculateAdress(workchain, initialCode, initialData);

        // Build contract source
        return new WalletV3R1Source({
            publicKey,
            workchain,
            walletId,
            address,
            initialCode,
            initialData
        });
    }

    readonly initialCode: Cell;
    readonly initialData: Cell;
    readonly address: Address;
    readonly publicKey: Buffer;
    readonly workchain: number;
    readonly walletId: number;
    readonly type = 'default:wallet-v3';

    private constructor(opts: {
        publicKey: Buffer,
        workchain: number,
        walletId: number,
        address: Address,
        initialCode: Cell,
        initialData: Cell
    }) {
        this.publicKey = opts.publicKey;
        this.workchain = opts.workchain;
        this.walletId = opts.walletId;
        this.address = opts.address;
        this.initialCode = opts.initialCode;
        this.initialData = opts.initialData;
    }
}