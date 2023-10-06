users (collection)
│
└── [userId] (document)
    │
    ├── email: "user@example.com"
    │
    └── kids (subcollection)
        │
        ├── [kidName] (document)
        │   ├── name: "Kid Name"
        │   ├── birthDate: "yyyy-mm-dd"
        │   ├── height: number
        │   └── weight: number
        │
        └── [anotherKidName] (document)
            ├── name: "Another Kid Name"
            ├── birthDate: "yyyy-mm-dd"
            ├── height: number
            └── weight: number
