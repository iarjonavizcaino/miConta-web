import { SessionService } from './session.serv';
import { AuthService } from './auth.serv';
import { TaxpayerResolve } from './taxpayer.resolve';
import { RoleGuard } from './role.guard.serv';
 import { AuthGuard } from './auth.guard.serv';
//  import { UserService } from './user.serv';
//  import { OutputResolve } from './output.resolve';
//  import { InputResolve } from './input.resolve';
//  import { TransferResolve } from './transfer.resolve';
//  import { KardexResolve } from './kardex.resolve';
//  import { SalesResolve } from './sales.resolve';
//  import { SaleResolve } from './sale.resolve';


export {
    /*UserService,
    OutputResolve,
    InputResolve,
    TransferResolve,
    KardexResolve,
    SalesResolve,
    SaleResolve,*/
    AuthGuard,
    RoleGuard,
    AuthService,
    SessionService,
    TaxpayerResolve
};
