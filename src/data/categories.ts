export interface Category {
  id: number;
  name: string;
  order: number;
}

export const categoriesDatabase: Category[] = [
  { id: 0, name: "Estadios", order: 1 },
  { id: 1, name: "Sedes", order: 2 },
  { id: 2, name: "Jugadas", order: 3 },
  { id: 3, name: "Países", order: 4 },
  { id: 4, name: "Mascotas", order: 5 },
  { id: 5, name: "Fanáticos", order: 6 },
  { id: 6, name: "Campeones", order: 7 },
  { id: 7, name: "Hechos históricos", order: 8 },
  { id: 8, name: "Balones", order: 9 },
  { id: 9, name: "Trofeos", order: 10 },
  { id: 10, name: "Murales urbanos", order: 11 },
  { id: 11, name: "Eliminatorias", order: 12 }
];