
type TCode = 200 | 201;



export function SuccessResult(msg = "Succuss", code: TCode = 200, data: any = null) {
    return { message: msg, code: code, data }
}




// export class SuccessResult extends CustomError {

//     constructor(msg = "Succuss", code: TCode, data: any) {

//         super(msg, code, true, data)
//     }

// }