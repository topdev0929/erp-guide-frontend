import { ToolNames } from "../tools";

export const LOAD_CONTEXT_INSTRUCTION = `
- ** Upon Loading Instructions ** 
  First, call the GetModuleContext tool with the module ID to get important user-specific context.`;

export const COMPLETE_MODULE_INSTRUCTION = `Immediately call the CompleteModule tool to mark this lesson as complete.`;

export const DISPLAY_LINK_INSTRUCTION = `You MUST DISPLAY THIS LINK TO THE USER: `;

export const BASE_MODULE_TOOLS = [
  ToolNames.GetModuleContext,
  ToolNames.CompleteModule,
  ToolNames.Home,
] as const;

export interface ModuleMetadata {
  id: string;
  name: string;
  description: string;
  tools: ToolNames[];
}

export interface InstructionModule {
  metadata: ModuleMetadata;
  instructions: string;
}

export const STEP_DIVIDER = `---`;

// Function to create a standard instruction step
export const createStep = (
  stepNumber: number,
  title: string,
  overview: string,
  prompt: string
) => {
  return `
## Step ${stepNumber}: ${title}
- ** First provide an overview to the user:**
${overview}
- **Prompt:**  
  "${prompt}"
  
*Wait for the user to share their thoughts, then acknowledge their response before moving on.*
${STEP_DIVIDER}
`;
};

// Interface for named step parameters
export interface NamedStepParams {
  number: number;
  title: string;
  overview: string;
  prompt: string;
}

// IMPORTANT COMMENT: WE SHOULD REPLACE CREATE STEP WITH namedStep; it's easier to read / use
export const namedStep = (params: NamedStepParams) => {
  return `
## Step ${params.number}: ${params.title}
- ** First provide an overview to the user:**
${params.overview}
- **Prompt:**  
  "${params.prompt}"
  
*STOP and Wait for the user to answer the question. DO NOT MOVE ONTO FUTURE STEPS UNTIL THEY"VE RESPONDED. Only after they've responded, should you acknowledge their response before moving on.*
${STEP_DIVIDER}
`;
};

// Function to create a standard instruction step based on the provided structure.
export const basicsCreateStep = (
  stepNumber: number,
  title: string,
  overview: string,
  prompt: string,
  responseHandling: string
): string => {
  return `
## Step ${stepNumber}: ${title}

**Overview:**
${overview}

**Prompt:**
"${prompt}"

**Response Handling:**
${responseHandling}

*Wait for the user to share their thoughts, then acknowledge their response before moving on.*
${STEP_DIVIDER}
`;
};
