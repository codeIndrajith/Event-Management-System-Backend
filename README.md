# Event-Management-System-Backend

src/
├── core/ # Domain layer
│ ├── entities/ # Business entities
│ ├── exceptions/ # Custom exceptions
│ ├── interfaces/ # Repository interfaces
│ └── types/ # Common types
│
├── application/ # Application layer
│ ├── dto/ # Data transfer objects
│ ├── use-cases/ # Business use cases
│ ├── mappers/ # Entity mappers
│ └── validators/ # Validation logic
│
├── infrastructure/ # Infrastructure layer
│ ├── database/ # Database related code
│ │ ├── migrations/ # Prisma migrations
│ │ ├── repositories/ # Concrete repository implementations
│ │ └── prisma.ts # Prisma client setup
│ ├── config/ # Configuration files
│ ├── logging/ # Logging setup
│ └── services/ # External services
│
├── presentation/ # Presentation layer
│ ├── controllers/ # Route controllers
│ ├── middlewares/ # Express middlewares
│ ├── routes/ # Route definitions
│ └── http/ # HTTP related types/utilities
│
├── shared/ # Shared utilities
│ ├── utils/ # Helper functions
│ └── constants/ # Application constants
│
└── main.ts # Application entry point
