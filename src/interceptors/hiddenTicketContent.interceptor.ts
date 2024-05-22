import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { Ticket } from "src/entities/ticket.entity";

export class HiddenTicketContent implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // console.log('intercroptor')
        return next.handle().pipe(map((tickets: Ticket[])=>{
            return tickets.map(ticket=>{
                const {content,...info} = ticket;
                return info;
            })
        }))
    }
}