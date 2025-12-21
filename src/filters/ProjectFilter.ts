import { BaseFilter } from "./BaseFilter";

export class ProjectFilters extends BaseFilter {
  constructor(query: Record<string, any>) {
    super(query);

    this.filters = {
      status: this.status,
      uuid: this.uuid,
      name: this.name,
    };
  }

  status(where: any, value: string) {
    if (value === "true" || value === "false") {
      where.AND.push({
        status: value === "true",
      });
    }
  }

  uuid(where: any, value: string) {
    where.AND.push({
      uuid: value,
    });
  }

  name(where: any, value: string) {
    where.AND.push({
      name: {
        contains: value,
      },
    });
  }
}
