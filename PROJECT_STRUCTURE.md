# Micro-Frontend Project Structure

This project has been reorganized to better separate the host application from remote micro-frontends.

## Directory Structure

```
/
├── host/                           # Host Application
│   ├── src/                        # Host source code
│   │   ├── components/             # Host components
│   │   ├── hooks/                  # Host hooks
│   │   ├── types/                  # TypeScript types
│   │   └── micro-frontends/        # Local micro-frontends (App2)
│   ├── package.json                # Host dependencies
│   ├── vite.config.ts              # Host Vite configuration
│   ├── tsconfig.json               # Host TypeScript config
│   └── index.html                  # Host HTML template
├── remote-app1/                    # Remote Micro-Frontend 1
│   ├── src/                        # Remote app source code
│   ├── package.json                # Remote app dependencies
│   ├── vite.config.ts              # Remote app Vite configuration
│   └── tsconfig.json               # Remote app TypeScript config
└── PROJECT_STRUCTURE.md            # This file
```

## Running the Applications

### Host Application (Port 5080)
```bash
cd host
npm install
npm run dev
```

### Remote Application (Port 5081)
```bash
cd remote-app1
npm run build
npm run preview
```

## Module Federation Configuration

- **Host**: Consumes remote micro-frontends via Module Federation
- **Remote**: Exposes TaskManager component for federation
- **Ports**: Host (5080), Remote (5081)
- **Federation URL**: `http://localhost:5081/assets/remoteEntry.js`

## Key Features

- ✅ **State Persistence**: Components maintain state across navigation
- ✅ **Error Recovery**: Retry mechanism for federation failures
- ✅ **Independent Deployment**: Each micro-frontend can be deployed separately
- ✅ **Shared Dependencies**: React 19.1 shared between applications
- ✅ **Professional Fallbacks**: Clean error handling with FederationFallback component

## Development Workflow

1. Start remote applications first (they need to be built and served)
2. Start the host application in development mode
3. Navigate between micro-frontends to test federation and state persistence
4. Test error scenarios by stopping/starting remote applications

## Adding New Micro-Frontends

1. Create a new directory at the root level (e.g., `remote-app2/`)
2. Configure Module Federation in the new app's `vite.config.ts`
3. Update the host's `vite.config.ts` to include the new remote
4. Add the new app to the host's navigation and routing logic
