export abstract class BaseFilter {
  protected query: Record<string, any>;
  protected filters: Record<string, (where: any, value: any) => void>;

  constructor(query: Record<string, any>) {
    this.query = query;
    this.filters = {};
  }

  apply() {
    const where: any = {
      AND: [], // ✅ REQUIRED
    };

    Object.keys(this.query).forEach((key) => {
      if (this.filters[key]) {
        this.filters[key](where, this.query[key]);
      }
    });

    // cleanup
    if (where.AND.length === 0) delete where.AND;

    return where;
  }
}
