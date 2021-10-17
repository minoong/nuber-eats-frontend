/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: DishParts
// ====================================================

export interface DishParts_options_chioces {
  __typename: "DishChoice";
  name: string;
  extra: number | null;
}

export interface DishParts_options {
  __typename: "DishOption";
  name: string;
  extra: number | null;
  chioces: DishParts_options_chioces[] | null;
}

export interface DishParts {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  options: DishParts_options[] | null;
}
