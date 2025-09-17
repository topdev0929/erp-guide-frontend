import { metaAssistant } from "@/app/meta/assistant";
import { allTools } from "@/app/meta/tools";
import { openai } from "@/app/openai";

function printAssistantTools(assistant) {
  console.log("Updated Assistant Tools:");
  assistant.tools.forEach((tool, index) => {
    console.log(`Tool ${index + 1}:`);
    console.log(`  Type: ${tool.type}`);
    if (tool.type === "function") {
      console.log(`  Function:`);
      console.log(`    Name: ${tool.function.name}`);
      console.log(`    Description: ${tool.function.description}`);
      console.log(
        `    Parameters: ${JSON.stringify(tool.function.parameters, null, 2)}`
      );
    }
  });
}

function printDivider(assistantName, position) {
  const length = 50;
  const remainder = Math.max(length - assistantName.length - 17, 0); // Ensure remainder is non-negative
  let append = "";

  if (position === "top") {
    append = "v".repeat(remainder);
  } else if (position === "bottom") {
    append = "^".repeat(remainder);
  }

  console.log("-".repeat(length));
  console.log(`Assistant Name: ${assistantName} ${append}`);
  console.log("-".repeat(length));
}

async function updateAssistant(id, instructions, tools) {
  try {
    const updatedAssistant = await openai.beta.assistants.update(id, {
      instructions: instructions,
      tools: tools,
    });
    printDivider(updatedAssistant.name, "top");
    console.log("Assistant updated successfully:", updatedAssistant);
    printAssistantTools(updatedAssistant);
    printDivider(updatedAssistant.name, "bottom");
    console.log("\n\n\n\n\n"); // Add 5 newlines here
    return updatedAssistant;
  } catch (error) {
    console.error("Error updating assistant:", error);
    throw error;
  }
}

async function main() {
  const failures: string[] = [];

  // Update Meta Assistant
  console.log("\n=== Updating Meta Assistant ===\n");
  try {
    // Use all available tools for the meta assistant
    const tools = Object.values(allTools);

    await updateAssistant(metaAssistant.id, metaAssistant.instructions, tools);
  } catch (error) {
    console.log("Hey, couldn't update Meta assistant.");
    failures.push("Meta");
  }

  // Final summary
  if (failures.length > 0) {
    console.log("\nThe following assistants failed to update:");
    failures.forEach((assistant) => console.log(`- ${assistant}`));
  } else {
    console.log("All assistants updated successfully!");
  }
}

main();
