import { CategoryEntity } from 'src/category/category.entity';

export const transformCategories = (
  categories: CategoryEntity[],
  id = 0,
  link = 'parent',
) =>
  categories
    .filter(item => item[link] === id)
    .map(item => ({
      ...item,
      children: transformCategories(categories, item.id),
    }));

export const idSubcategories = (
  categories: CategoryEntity[],
  id = 0,
  link = 'parent',
) => {
  let ids = [];

  categories
    .filter(item => item[link] === id)
    .map(item => {
      ids = [...ids, item.id, ...idSubcategories(categories, item.id)];
    });

  return ids;
};
