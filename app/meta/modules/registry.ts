import { InstructionModule, ModuleMetadata } from "./module-constants";
import { erpSessionModule } from "./erp-session";
import { shapeshiftingModule } from "./shapeshifting";
import { ocdStigmaModule } from "./ocd-stigma";
import { compulsiveErpModule } from "./compulsive-erp";
import { doubtingDiseaseModule } from "./doubting-disease";
import { exposureTechniquesModule } from "./exposure-techniques";
import { basicsModule } from "./basics";
import { exposurePlanModule } from "./exposure-plan";
import { firstErpModule } from "./first-erp";
import { hierarchyModule } from "./hierarchy";
import { motivationModule } from "./motivation";
import { nextStepsModule } from "./next-steps";
import { obsessionsCompulsionsModule } from "./obsessions-compulsions";
import { scriptWritingModule } from "./script-writing";
import { subtypesModule } from "./subtypes";
import { misdiagnosisModule } from "./misdiagnosis";
import { pureOModule } from "./pureo";
import { ocdAdhdAnxietyTraumaModule } from "./ocd-adhd-anxiety-trauma";
// Add new modules to this object
const modules: { [key: string]: InstructionModule } = {
  [erpSessionModule.metadata.id]: erpSessionModule,
  [shapeshiftingModule.metadata.id]: shapeshiftingModule,
  [ocdStigmaModule.metadata.id]: ocdStigmaModule,
  [compulsiveErpModule.metadata.id]: compulsiveErpModule,
  [doubtingDiseaseModule.metadata.id]: doubtingDiseaseModule,
  [exposureTechniquesModule.metadata.id]: exposureTechniquesModule,
  [basicsModule.metadata.id]: basicsModule,
  [exposurePlanModule.metadata.id]: exposurePlanModule,
  [firstErpModule.metadata.id]: firstErpModule,
  [hierarchyModule.metadata.id]: hierarchyModule,
  [motivationModule.metadata.id]: motivationModule,
  [nextStepsModule.metadata.id]: nextStepsModule,
  [obsessionsCompulsionsModule.metadata.id]: obsessionsCompulsionsModule,
  [scriptWritingModule.metadata.id]: scriptWritingModule,
  [subtypesModule.metadata.id]: subtypesModule,
  [misdiagnosisModule.metadata.id]: misdiagnosisModule,
  [pureOModule.metadata.id]: pureOModule,
  [ocdAdhdAnxietyTraumaModule.metadata.id]: ocdAdhdAnxietyTraumaModule,
  // future modules will be added here
};

export const moduleRegistry = {
  // Get list of all available modules (just metadata)
  listModules(): ModuleMetadata[] {
    return Object.values(modules).map((module) => module.metadata);
  },

  // Get a specific module by ID
  getModule(moduleId: string): InstructionModule | undefined {
    return modules[moduleId];
  },

  // Check if a module exists
  hasModule(moduleId: string): boolean {
    return moduleId in modules;
  },
};
