export interface List<T> {
  [id: number]: T;
}

export class SetTicketDTO {
  id: number;

  tickets: number[];
}
