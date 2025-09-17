export enum ApiMethod {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Delete = "DELETE",
  Patch = "PATCH",
}

// This is used for lesson completion. These are the values that are also stored in the backend. We do not want these to differ from the backend completed_lessons array on the MangoUser model.
export enum SessionType {
  ObsessionsCompulsions = "obsessions-compulsions",
  ScriptWriting = "script-writing",
  Basics = "basics",
  ERP = "erp",
  Motivation = "motivation",
  ExposurePlan = "exposure-plan",
  Hierarchy = "hierarchy",
  FirstErp = "first-erp",
  Subtypes = "subtypes",
  NextSteps = "next-steps",
  ExposureTechniques = "exposure-techniques",
  OCDStigma = "ocd-stigma",
  Shapeshifting = "shapeshifting",
  DoubtingDisease = "doubting-disease",
  CompulsiveErp = "compulsive-erp",
  Meta = "meta",
  Misdiagnosis = "misdiagnosis",
  PureO = "pureo",
  OCDADHDAnxietyPTSD = "ocd-adhd-anxiety-ptsd",
}

export namespace AssistantStreamEvent {
  export interface ThreadRunRequiresAction {
    event: "thread.run.requires_action";
    data: any; // Update this with the actual type if known
  }
}

export interface AssistantStream {
  on(event: string, callback: (data?: any) => void): void;
}
