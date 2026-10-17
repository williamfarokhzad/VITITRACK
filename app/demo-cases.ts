export const demoCases = [
  {
    "id": "italy",
    "country": "Italia",
    "name": "Giulia Rossi",
    "image": "/demo-people/italy.webp",
    "thumb": "/demo-people/italy-thumb.webp",
    "source": "exec-53639d90-98b8-4446-929b-d8d94fdc488b.png"
  },
  {
    "id": "nigeria",
    "country": "Nigeria",
    "name": "Daniel Okafor",
    "image": "/demo-people/nigeria.webp",
    "thumb": "/demo-people/nigeria-thumb.webp",
    "source": "exec-49e18df0-bf47-4ed2-9396-425216143dfb.png"
  },
  {
    "id": "india",
    "country": "India",
    "name": "Anaya Shah",
    "image": "/demo-people/india.webp",
    "thumb": "/demo-people/india-thumb.webp",
    "source": "exec-e4c675fa-8c40-45a7-bf93-78122d6d84a2.png"
  },
  {
    "id": "japan",
    "country": "Giappone",
    "name": "Kenji Sato",
    "image": "/demo-people/japan.webp",
    "thumb": "/demo-people/japan-thumb.webp",
    "source": "exec-ca89c7ce-b120-408f-b36d-ef6100f9e334.png"
  },
  {
    "id": "brazil",
    "country": "Brasile",
    "name": "Camila Costa",
    "image": "/demo-people/brazil.webp",
    "thumb": "/demo-people/brazil-thumb.webp",
    "source": "exec-76987e46-cb9d-46cf-a826-563df96b891e.png"
  },
  {
    "id": "iran",
    "country": "Iran",
    "name": "Arman Rahimi",
    "image": "/demo-people/iran.webp",
    "thumb": "/demo-people/iran-thumb.webp",
    "source": "exec-54195b0c-7890-401b-bad3-65a2758d526b.png"
  },
  {
    "id": "sweden",
    "country": "Svezia",
    "name": "Elin Berg",
    "image": "/demo-people/sweden.webp",
    "thumb": "/demo-people/sweden-thumb.webp",
    "source": "exec-dff151de-9f74-4019-8634-ba2fe8f83b37.png"
  },
  {
    "id": "morocco",
    "country": "Marocco",
    "name": "Salma Amrani",
    "image": "/demo-people/morocco.webp",
    "thumb": "/demo-people/morocco-thumb.webp",
    "source": "exec-06302c27-d3fe-4a80-be91-643660923fc6.png"
  },
  {
    "id": "south-africa",
    "country": "Sudafrica",
    "name": "Naledi Dlamini",
    "image": "/demo-people/south-africa.webp",
    "thumb": "/demo-people/south-africa-thumb.webp",
    "source": "exec-f6eac383-6ddd-45cc-b18f-ce075bfe1024.png"
  },
  {
    "id": "south-korea",
    "country": "Corea del Sud",
    "name": "Minjun Park",
    "image": "/demo-people/south-korea.webp",
    "thumb": "/demo-people/south-korea-thumb.webp",
    "source": "exec-81cf5cba-fc38-4e74-bfc2-30f132d9c40c.png"
  }
] as const;
export type DemoCase = (typeof demoCases)[number];
