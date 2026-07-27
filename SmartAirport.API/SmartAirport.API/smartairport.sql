IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [Flights] (
    [FlightId] int NOT NULL IDENTITY,
    [FlightCode] nvarchar(max) NOT NULL,
    [Destination] nvarchar(max) NULL,
    [Airline] nvarchar(max) NULL,
    [DepartureTime] datetime2 NULL,
    [FlightNumber] nvarchar(max) NULL,
    CONSTRAINT [PK_Flights] PRIMARY KEY ([FlightId])
);

CREATE TABLE [QueueTickets] (
    [TicketId] int NOT NULL IDENTITY,
    [QueueNumber] nvarchar(max) NOT NULL,
    [ServiceType] nvarchar(max) NOT NULL,
    [Status] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [EstimatedTime] int NULL,
    [CounterId] int NULL,
    [FlightCode] nvarchar(max) NULL,
    [FlightNumber] nvarchar(max) NULL,
    CONSTRAINT [PK_QueueTickets] PRIMARY KEY ([TicketId])
);

CREATE TABLE [Users] (
    [UserId] int NOT NULL IDENTITY,
    [FullName] nvarchar(max) NOT NULL,
    [Email] nvarchar(max) NOT NULL,
    [PasswordHash] nvarchar(max) NOT NULL,
    [Role] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([UserId])
);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260727084224_InitialCreate', N'10.0.10');

COMMIT;
GO

