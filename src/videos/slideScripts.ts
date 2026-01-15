// Scripts for each slide in Module 1
// Optimized for Chatterbox Turbo TTS with natural code reading
// Follows UPGRADE.md guidelines for better voice quality

export const module1Scripts = {
  title:
    "If you deploy on A W S and you're still clicking around in the console, you're wasting time and introducing risk. Infrastructure as Code lets you treat infrastructure exactly like application code. It becomes repeatable, auditable, and automated instead of tribal knowledge. In this series we're going to use Pulumi to build real A W S infrastructure using TypeScript. By the end, you'll be able to provision VPCs, manage multiple environments, export outputs, and destroy infrastructure cleanly with a single command. This is the workflow modern DevOps and platform teams use in production.",

  whyIaC:
    "So why Infrastructure as Code? Five reasons. One: repeatability. You can rebuild the same environment a hundred times with zero drift. Two: version control. Changes are reviewed, not silently edited in production. Three: automation. Provisioning and teardown become scripts instead of manual work. Four: reduced human error and faster recovery during incidents. And five: your infrastructure becomes documentation you can execute.",

  comparison:
    "Traditional Infrastructure as Code tools like Terraform and CloudFormation use domain-specific languages like H C L and Y A M L. They work, but they're constrained. Limited programming constructs, separate testing workflows, and slower developer feedback loops. Pulumi takes a different approach. You write infrastructure using real programming languages like TypeScript and Python. You get IDE autocomplete, reusable functions, unit tests, and proper error handling. The developer ergonomics are simply better.",

  workflow:
    "The Pulumi workflow is simple. Initialize a project. Preview the changes. Apply them. And optionally destroy them. The commands map directly. pulumi init creates your project. pulumi preview shows planned changes. pulumi up deploys to A W S. pulumi destroy tears everything down. And pulumi config manages per-environment settings.",

  initCode:
    "Let's initialize a project. Run: pulumi new aws-typescript. Pulumi generates a full project structure. index dot ts contains the infrastructure code. pulumi dot yaml stores project metadata. pulumi dot dev dot yaml stores stack configuration. And package dot json manages dependencies. Each file has a specific purpose.",

  whyTypeScript:
    "Why TypeScript for DevOps? Type safety catches errors before deployment. IntelliSense speeds up authoring. The ecosystem integrates cleanly with A W S SDKs. It's familiar to most engineers. And it's easy to test and refactor.",

  typescriptCode:
    "Let's walk through a simple Pulumi example. We import the A W S library. We create a VPC using the new keyword. We set the CIDR block to ten dot zero dot zero dot zero slash sixteen. We enable DNS hostnames and DNS support. We add organizational tags like Name and Environment. And finally we export the VPC ID so it can be consumed by other stacks.",

  summary:
    "To summarize module one. Infrastructure as Code gives you repeatable and version-controlled infrastructure. Pulumi offers a better developer experience than traditional tools. TypeScript brings type safety to infrastructure code. And the workflow is init, preview, up, destroy, and config. In the next module, we'll configure A W S credentials for deployment.",
};
