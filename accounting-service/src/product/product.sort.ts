export function buildProductOrderBy(sortBy: string, order: 'asc' | 'desc') {
  switch (sortBy) {
    case 'name':
      return [{ name: order }, { id: order }];
    case 'created_at':
    default:
      return [{ created_at: order }, { id: order }];
  }
}
