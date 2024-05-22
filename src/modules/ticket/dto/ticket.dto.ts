import { Exclude } from "class-transformer"
import { IsDate, MaxLength } from "class-validator"
import { Member } from "src/entities/member.entity"
import { Project } from "src/entities/project.entity"
import { StatusType } from "src/entities/ticket.entity"

export class TicketDTO{
    id?: number

    @MaxLength(120)
    title?: string

    @MaxLength(5000)
    content?: string

    deadline?: Date

    status?: StatusType

    assign?: Member

    project?: Project
}