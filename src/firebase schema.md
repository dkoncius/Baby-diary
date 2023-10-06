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
        │   └── image: string
        │
        └── [anotherKidName] (document)
            ├── name: "Another Kid Name"
            ├── birthDate: "yyyy-mm-dd"
            ├── height: number
            └── weight: number


Cloud storage for images
- users
  - {userId}
    - {kidId}
      - images
        - profile-image
          - image (e.g., profile-pic.jpg)
        - memories
          - {memory}
            - memory-images
              - image1 (e.g., memory-pic1.jpg)
              - image2 (e.g., memory-pic2.jpg)
              - ...
