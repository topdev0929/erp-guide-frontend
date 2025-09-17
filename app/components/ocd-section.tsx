import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Brain,
  Target,
  AlertCircle,
  Plus,
  Check,
  Activity,
  Trash2,
  CheckCircle,
  Edit,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationModal } from "../insights/delete-confirmation-modal";
import type { Subtype, OCDItem } from "@/app/types/dashboard";
import { useOCDData } from "./ocd-data";
import { ApiMethod } from "@/app/types/types";
import { apiCall } from "@/app/api/api-utils";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EditItemModal = ({
  item,
  type,
  subtypes,
  onClose,
  onSave,
}: {
  item:
    | OCDItem
    | {
        id: string;
        description: string;
        subtype: string | null;
        discomfort?: number;
      };
  type: "obsessions" | "compulsions" | "exposures";
  subtypes: Subtype[];
  onClose: () => void;
  onSave: (
    id: any,
    description: string,
    subtypeId: number | null,
    discomfort?: number
  ) => void;
}) => {
  const [description, setDescription] = useState(item.description);
  const [selectedSubtype, setSelectedSubtype] = useState<number | null>(
    item.subtype ? Number(item.subtype) : null
  );
  const [discomfort, setDiscomfort] = useState(
    "discomfort" in item && typeof item.discomfort === "number"
      ? item.discomfort
      : 5
  );

  const handleSave = async () => {
    if (type === "exposures") {
      onSave(item.id, description, selectedSubtype, discomfort);
    } else {
      onSave(item.id, description, selectedSubtype);
    }
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Edit{" "}
            {type === "obsessions"
              ? "Obsession"
              : type === "compulsions"
              ? "Compulsion"
              : "Exposure"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="subtype" className="text-sm font-medium">
              Subtype
            </label>
            <Select
              value={selectedSubtype?.toString() || "none"}
              onValueChange={(value) =>
                setSelectedSubtype(value === "none" ? null : parseInt(value))
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a subtype" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {subtypes.map((subtype) => (
                  <SelectItem key={subtype.id} value={subtype.id.toString()}>
                    {subtype.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {type === "exposures" && (
            <div className="grid gap-2">
              <label htmlFor="discomfort" className="text-sm font-medium">
                Intensity (1-10)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="discomfort"
                  type="range"
                  min={1}
                  max={10}
                  value={discomfort}
                  onChange={(e) => setDiscomfort(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm font-mono w-6 text-right">
                  {discomfort}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AddItemModal = ({
  type,
  onClose,
  onSave,
  subtypes,
}: {
  type: "obsession" | "compulsion" | "exposure";
  onClose: () => void;
  onSave: (
    description: string,
    subtypeId: number | null,
    discomfort?: number
  ) => void;
  subtypes: Subtype[];
}) => {
  const [description, setDescription] = useState("");
  const [selectedSubtype, setSelectedSubtype] = useState<number | null>(null);
  const [discomfort, setDiscomfort] = useState(5);

  const handleSave = () => {
    if (description.trim()) {
      if (type === "exposure") {
        onSave(description, selectedSubtype, discomfort);
      } else {
        onSave(description, selectedSubtype);
      }
      onClose();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Add {type.charAt(0).toUpperCase() + type.slice(1)}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder={`Type your ${type} here...`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="subtype" className="text-sm font-medium">
              Subtype
            </label>
            <Select
              value={selectedSubtype?.toString() || "none"}
              onValueChange={(value) =>
                setSelectedSubtype(value === "none" ? null : parseInt(value))
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a subtype (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {subtypes.map((subtype) => (
                  <SelectItem key={subtype.id} value={subtype.id.toString()}>
                    {subtype.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {type === "exposure" && (
            <div className="grid gap-2">
              <label htmlFor="discomfort" className="text-sm font-medium">
                Intensity (1-10)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="discomfort"
                  type="range"
                  min={1}
                  max={10}
                  value={discomfort}
                  onChange={(e) => setDiscomfort(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm font-mono w-6 text-right">
                  {discomfort}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const MyOCDSection = () => {
  const searchParams = useSearchParams();
  const ocdTab = searchParams.get("ocd_tab");
  const {
    obsessions,
    compulsions,
    subtypes,
    exposures,
    error,
    updateSubtypes,
    deleteSubtype,
    updateCompulsions,
    deleteCompulsion,
    updateObsessions,
    deleteObsession,
    updateExposures,
    deleteExposure,
    editSubtype,
    editObsession,
    editCompulsion,
    editExposure,
  } = useOCDData();
  const [subtypeToDelete, setSubtypeToDelete] = useState<Subtype | null>(null);
  const [showGettingStartedPopup, setShowGettingStartedPopup] = useState(false);
  const [selectedObsession, setSelectedObsession] = useState<any | null>(null);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const [newSubtype, setNewSubtype] = useState("");
  const [isAddingSubtype, setIsAddingSubtype] = useState(false);
  const [editingSubtype, setEditingSubtype] = useState<Subtype | null>(null);

  const [selectedExposure, setSelectedExposure] = useState<any | null>(null);

  const [isAddingObsession, setIsAddingObsession] = useState(false);
  const [isAddingCompulsion, setIsAddingCompulsion] = useState(false);
  const [isAddingExposure, setIsAddingExposure] = useState(false);

  const [editingItem, setEditingItem] = useState<{
    item: OCDItem | { id: string; description: string; subtype: string | null };
    type: "obsessions" | "compulsions" | "exposures";
  } | null>(null);
  const [erpCount, setErpCount] = useState(0);

  useEffect(() => {
    const fetchErpCount = async () => {
      const response = await apiCall(
        "/lessons/erp-sessions/",
        ApiMethod.Get,
        "Fetching ERP sessions"
      );
      console.log(response);
      setErpCount(response.erp_count);
    };
    fetchErpCount();
  }, []);

  const router = useRouter();

  const handleAddCompulsion = async (
    description: string,
    subtypeId: number | null
  ) => {
    try {
      const response = await apiCall(
        "/ocd/compulsions/",
        ApiMethod.Post,
        "Adding new compulsion",
        [
          {
            description: description.trim(),
            subtype: subtypeId,
          },
        ]
      );

      if (response && response[0]) {
        updateCompulsions(response[0]);
        setIsAddingCompulsion(false);
      }
    } catch (error) {
      console.error("Error adding compulsion:", error);
    }
  };

  const handleAddSubtype = async () => {
    if (!newSubtype.trim()) return;

    try {
      const response = await apiCall(
        "/ocd/subtypes/",
        ApiMethod.Post,
        "Adding new subtype",
        [
          {
            name: newSubtype.trim(),
          },
        ]
      );

      if (response && response[0]) {
        // Add new subtype to local state
        updateSubtypes(response[0]);

        // Reset form
        setNewSubtype("");
        setIsAddingSubtype(false);
      }
    } catch (error) {
      console.error("Error adding subtype:", error);
    }
  };

  const handleEditSubtype = async (subtype: Subtype, newName: string) => {
    if (!newName.trim()) return;

    try {
      const response = await apiCall(
        "/ocd/subtypes/",
        ApiMethod.Patch,
        "Editing subtype",
        [
          {
            id: subtype.id,
            name: newName.trim(),
          },
        ]
      );

      if (response) {
        editSubtype(subtype.id, newName.trim());
        setEditingSubtype(null);
        setDeleteSuccess(true);
        setTimeout(() => setDeleteSuccess(false), 2000);
      }
    } catch (error) {
      console.error("Error editing subtype:", error);
    }
  };

  const handleDeleteSubtype = async (subtype: Subtype) => {
    try {
      const response = await apiCall(
        "/ocd/subtypes/",
        ApiMethod.Delete,
        "Deleting subtype",
        {
          ids: [subtype.id],
        }
      );

      if (response || response === null) {
        // Update local state by removing the deleted subtype
        deleteSubtype(subtype.id);

        // Close the deletion modal
        setSubtypeToDelete(null);

        // Show success message
        setDeleteSuccess(true);
        setTimeout(() => setDeleteSuccess(false), 2000);
      }
    } catch (error) {
      console.error("Error deleting subtype:", error);
    }
  };

  const handleDeleteItem = async (
    id: number,
    type: "obsessions" | "compulsions"
  ) => {
    try {
      const response = await apiCall(
        `/ocd/${type}/`,
        ApiMethod.Delete,
        `Deleting ${type}`,
        {
          ids: [id],
        }
      );

      if (response || response === null) {
        // Update local state based on the type
        if (type === "obsessions") {
          deleteObsession(id);
        } else if (type === "compulsions") {
          deleteCompulsion(id);
        }

        // Show success message
        setDeleteSuccess(true);
        setTimeout(() => setDeleteSuccess(false), 2000);
      }
    } catch (error) {
      console.error(`Error deleting ${type} item:`, error);
    }
  };

  const handleAddObsession = async (
    description: string,
    subtypeId: number | null
  ) => {
    try {
      const response = await apiCall(
        "/ocd/obsessions/",
        ApiMethod.Post,
        "Adding new obsession",
        {
          description: description.trim(),
          subtype: subtypeId,
        }
      );

      if (response) {
        updateObsessions(response);
        setIsAddingObsession(false);
      }
    } catch (error) {
      console.error("Error adding obsession:", error);
    }
  };

  const handleAddExposure = async (
    description: string,
    subtypeId: number | null,
    discomfort: number
  ) => {
    try {
      const response = await apiCall(
        "/exposures/hierarchy/",
        ApiMethod.Post,
        "Adding new exposure",
        [
          {
            description: description.trim(),
            subtype: subtypeId,
            discomfort,
          },
        ]
      );

      if (response && response[0]) {
        updateExposures(response[0]);
        setIsAddingExposure(false);
      }
    } catch (error) {
      console.error("Error adding exposure:", error);
    }
  };

  const handleDeleteExposure = async (id: string) => {
    try {
      const response = await apiCall(
        "/exposures/hierarchy/",
        ApiMethod.Delete,
        "Deleting exposure",
        {
          ids: [id],
        }
      );

      if (response || response === null) {
        // Update local state
        deleteExposure(id);

        // Clear selection if the deleted exposure was selected
        if (selectedExposure?.id === id) {
          setSelectedExposure(null);
        }

        // Show success message
        setDeleteSuccess(true);
        setTimeout(() => setDeleteSuccess(false), 2000);
      }
    } catch (error) {
      console.error("Error deleting exposure:", error);
    }
  };

  const handleEditItem = async (
    id: number | string,
    description: string,
    subtypeId: number | null,
    discomfort?: number
  ) => {
    try {
      const endpoint =
        editingItem?.type === "exposures"
          ? "/exposures/hierarchy/"
          : `/ocd/${editingItem?.type}/`;

      const response = await apiCall(
        endpoint,
        ApiMethod.Patch,
        `Editing ${editingItem?.type}`,
        editingItem?.type === "exposures"
          ? [{ id, description, subtype: subtypeId, discomfort }]
          : [{ id, description, subtype: subtypeId, current: true }]
      );

      if (response) {
        if (editingItem?.type === "obsessions") {
          editObsession(id as number, description, subtypeId);
        } else if (editingItem?.type === "compulsions") {
          editCompulsion(id as number, description, subtypeId);
        } else if (editingItem?.type === "exposures") {
          editExposure(id as string, description, subtypeId, discomfort);
        }
        setEditingItem(null);
        setDeleteSuccess(true);
        setTimeout(() => setDeleteSuccess(false), 2000);
      }
    } catch (error) {
      console.error(`Error editing ${editingItem?.type}:`, error);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const currentObsessions = obsessions.filter((o) => o.current);
  const currentCompulsions = compulsions.filter((c) => c.current);
  const sortedExposures = [...exposures].sort(
    (a, b) => (a.discomfort || 0) - (b.discomfort || 0)
  );

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-md border-none p-4">
        <div className="space-y-4">
          <Accordion
            type="multiple"
            className="bg-white rounded-lg"
            defaultValue={[ocdTab]}
          >
            <AccordionItem
              value="subtypes"
              className="border-b border-[#349934]/10"
            >
              <AccordionTrigger className="px-4 py-3 text-[#1e543b] hover:bg-[#349934]/5">
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-2 text-[#349934]" />
                  <span>Subtypes</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="space-y-2">
                  {subtypes.map((subtype) => (
                    <div
                      key={subtype.id}
                      className="flex items-center justify-between p-2 bg-[#349934]/5 rounded-md"
                    >
                      {editingSubtype?.id === subtype.id ? (
                        <div className="flex items-center gap-2 flex-grow">
                          <Input
                            type="text"
                            value={editingSubtype.name}
                            onChange={(e) =>
                              setEditingSubtype({
                                ...editingSubtype,
                                name: e.target.value,
                              })
                            }
                            className="flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleEditSubtype(subtype, editingSubtype.name);
                              }
                            }}
                          />
                          <Button
                            onClick={() =>
                              handleEditSubtype(subtype, editingSubtype.name)
                            }
                            className="bg-[#349934] hover:bg-[#349934]/90 text-white"
                            size="sm"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={() => setEditingSubtype(null)}
                            variant="outline"
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm text-[#1e543b]">
                            {subtype.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingSubtype(subtype);
                              }}
                              className="p-1 text-gray-500 hover:text-[#349934] rounded-full hover:bg-[#349934]/10 transition-colors"
                              aria-label="Edit subtype"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSubtypeToDelete(subtype);
                              }}
                              className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                              aria-label="Delete subtype"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {isAddingSubtype ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        placeholder="Type your subtype here..."
                        value={newSubtype}
                        onChange={(e) => setNewSubtype(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddSubtype();
                          }
                        }}
                      />
                      {showSavedMessage ? (
                        <div className="flex items-center gap-1 text-[#349934] px-3 py-1.5">
                          <Check className="h-4 w-4" />
                          <span>Saved</span>
                        </div>
                      ) : (
                        <>
                          <Button
                            onClick={handleAddSubtype}
                            className="bg-[#349934] hover:bg-[#349934]/90 text-white"
                            size="sm"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={() => {
                              setIsAddingSubtype(false);
                              setNewSubtype("");
                            }}
                            variant="outline"
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  ) : (
                    <Button
                      onClick={() => setIsAddingSubtype(true)}
                      variant="ghost"
                      className="w-full flex items-center gap-2 text-[#349934] hover:bg-[#349934]/10"
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add Subtype
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="obsessions"
              className="border-b border-[#349934]/10"
            >
              <AccordionTrigger className="px-4 py-3 text-[#1e543b] hover:bg-[#349934]/5">
                <div className="flex items-center">
                  <Brain className="h-4 w-4 mr-2 text-[#349934]" />
                  <span>Obsessions</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="space-y-2">
                  {currentObsessions.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                        selectedObsession?.id === item.id
                          ? "bg-[#349934]/20 border border-[#349934]/30"
                          : "bg-[#349934]/5 hover:bg-[#349934]/10"
                      }`}
                      onClick={() =>
                        setSelectedObsession(
                          selectedObsession?.id === item.id ? null : item
                        )
                      }
                    >
                      <div className="flex flex-col">
                        <span className="text-sm text-[#1e543b]">
                          {item.description}
                        </span>
                        {item.subtype && (
                          <span className="text-xs text-[#349934]/70">
                            {
                              subtypes.find(
                                (s) => s.id === Number(item.subtype)
                              )?.name
                            }
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingItem({ item, type: "obsessions" });
                          }}
                          className="p-1 text-gray-500 hover:text-[#349934] rounded-full hover:bg-[#349934]/10 transition-colors"
                          aria-label="Edit obsession"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {selectedObsession?.id === item.id && (
                          <div className="h-2 w-2 rounded-full bg-[#349934] mr-2"></div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item.id, "obsessions");
                          }}
                          className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                          aria-label="Delete obsession"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {isAddingObsession ? (
                    <AddItemModal
                      type="obsession"
                      onClose={() => setIsAddingObsession(false)}
                      onSave={handleAddObsession}
                      subtypes={subtypes}
                    />
                  ) : (
                    <Button
                      onClick={() => setIsAddingObsession(true)}
                      variant="ghost"
                      className="w-full flex items-center gap-2 text-[#349934] hover:bg-[#349934]/10"
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add Obsession
                    </Button>
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  {selectedObsession ? (
                    <Button
                      variant="default"
                      className="mt-4"
                      onClick={() => {
                        router.push(
                          `/plans/initial-questions?obsession=${encodeURIComponent(
                            selectedObsession.description
                          )}`
                        );
                      }}
                    >
                      Create Exposure Plan
                    </Button>
                  ) : (
                    <Button
                      className="bg-gray-300 text-gray-500 flex items-center gap-1 cursor-not-allowed"
                      size="sm"
                      disabled
                    >
                      <Plus className="h-4 w-4" />
                      Create Exposure Plan
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="compulsions"
              className="border-b border-[#349934]/10"
            >
              <AccordionTrigger className="px-4 py-3 text-[#1e543b] hover:bg-[#349934]/5">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-[#349934]" />
                  <span>Compulsions</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="space-y-2">
                  {currentCompulsions.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 bg-[#349934]/5 rounded-md"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm text-[#1e543b]">
                          {item.description}
                        </span>
                        {item.subtype && (
                          <span className="text-xs text-[#349934]/70">
                            {
                              subtypes.find(
                                (s) => s.id === Number(item.subtype)
                              )?.name
                            }
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingItem({ item, type: "compulsions" });
                          }}
                          className="p-1 text-gray-500 hover:text-[#349934] rounded-full hover:bg-[#349934]/10 transition-colors"
                          aria-label="Edit compulsion"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item.id, "compulsions");
                          }}
                          className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                          aria-label="Delete compulsion"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {isAddingCompulsion ? (
                    <AddItemModal
                      type="compulsion"
                      onClose={() => setIsAddingCompulsion(false)}
                      onSave={handleAddCompulsion}
                      subtypes={subtypes}
                    />
                  ) : (
                    <Button
                      onClick={() => setIsAddingCompulsion(true)}
                      variant="ghost"
                      className="w-full flex items-center gap-2 text-[#349934] hover:bg-[#349934]/10"
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add Compulsion
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="exposures"
              className="border-b border-[#349934]/10"
            >
              <AccordionTrigger className="px-4 py-3 text-[#1e543b] hover:bg-[#349934]/5">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-[#349934]" />
                  <span>Exposures</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-[#349934]/10 text-[#349934] px-3 py-1 rounded-full text-xs font-medium border border-[#349934]/20">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>{erpCount} ERP Session{erpCount !== 1 ? 's' : ''} completed</span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="space-y-2">
                  {sortedExposures.map((exposure) => (
                    <div
                      key={exposure.id}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                        selectedExposure?.id === exposure.id
                          ? "bg-[#349934]/20 border border-[#349934]/30"
                          : "bg-[#349934]/5 hover:bg-[#349934]/10"
                      }`}
                    >
                      <div
                        className="flex flex-col flex-grow"
                        onClick={() =>
                          setSelectedExposure(
                            selectedExposure?.id === exposure.id
                              ? null
                              : exposure
                          )
                        }
                      >
                        <span className="text-sm text-[#1e543b]">
                          {exposure.description}
                        </span>
                        {exposure.subtype && (
                          <span className="text-xs text-[#349934]/70">
                            {
                              subtypes.find(
                                (s) => s.id === Number(exposure.subtype)
                              )?.name
                            }
                          </span>
                        )}
                        <span className="text-xs text-[#1e543b]/80">
                          Intensity: {exposure.discomfort || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingItem({
                              item: exposure,
                              type: "exposures",
                            });
                          }}
                          className="p-1 text-gray-500 hover:text-[#349934] rounded-full hover:bg-[#349934]/10 transition-colors"
                          aria-label="Edit exposure"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {selectedExposure?.id === exposure.id && (
                          <div className="h-2 w-2 rounded-full bg-[#349934] mr-2"></div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteExposure(exposure.id);
                          }}
                          className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                          aria-label="Delete exposure"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {isAddingExposure ? (
                    <AddItemModal
                      type="exposure"
                      onClose={() => setIsAddingExposure(false)}
                      onSave={handleAddExposure}
                      subtypes={subtypes}
                    />
                  ) : (
                    <Button
                      onClick={() => setIsAddingExposure(true)}
                      variant="ghost"
                      className="w-full flex items-center gap-2 text-[#349934] hover:bg-[#349934]/10"
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add Exposure
                    </Button>
                  )}
                  {exposures.length === 0 && !isAddingExposure && (
                    <div className="text-center py-4 text-[#1e543b]/60">
                      No exposures created yet
                    </div>
                  )}
                  <div className="mt-4 flex flex-col sm:flex-row gap-2 w-full">
                    {selectedExposure ? (
                      <>
                        <Button
                          variant="default"
                          className="w-full sm:w-auto whitespace-nowrap"
                          onClick={() => {
                            router.push(
                              `/plans/initial-questions?selectedExposure=${encodeURIComponent(
                                selectedExposure.description
                              )}`
                            );
                          }}
                        >
                          Create Exposure Plan
                        </Button>
                        <Button
                          variant="default"
                          className="w-full sm:w-auto whitespace-nowrap"
                          onClick={() => {
                            router.push(
                              `chat/erp?returnPath=/me&exposureId=${selectedExposure.id}`
                            );
                          }}
                        >
                          Start Exposure Session
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          className="w-full sm:w-auto whitespace-nowrap bg-gray-300 text-gray-500 cursor-not-allowed"
                          size="sm"
                          disabled
                        >
                          Create Exposure Plan
                        </Button>
                        <Button
                          className="w-full sm:w-auto whitespace-nowrap bg-gray-300 text-gray-500 cursor-not-allowed"
                          size="sm"
                          disabled
                        >
                          Start Exposure Session
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Progress & Scores Link */}
          <Link
            href="/insights/"
            className="flex items-center py-3 hover:bg-[#349934]/5 rounded-lg transition-colors mt-2"
          >
            <div className="flex items-center ml-4">
              <Calendar className="h-4 w-4 mr-2 text-[#349934]" />
              <span className="text-[#1e543b]">OCD Scores</span>
            </div>
            <div className="ml-auto mr-4">
              <ChevronRight className="h-4 w-4 text-[#349934]" />
            </div>
          </Link>
        </div>
      </Card>

      {subtypeToDelete && (
        <DeleteConfirmationModal
          subtypeName={subtypeToDelete.name}
          onConfirm={() => handleDeleteSubtype(subtypeToDelete)}
          onCancel={() => setSubtypeToDelete(null)}
        />
      )}

      {deleteSuccess && (
        <div className="fixed top-4 right-4 bg-[#349934] text-white px-4 py-2 rounded-md shadow-lg flex items-center z-50 animate-in fade-in slide-in-from-top-5 duration-300">
          <CheckCircle className="h-5 w-5 mr-2" />
          Changes saved
        </div>
      )}

      <Dialog
        open={showGettingStartedPopup}
        onOpenChange={setShowGettingStartedPopup}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-[#1e543b]">
              Welcome to Your OCD Profile
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              It looks like there isn't much here yet. Complete the 'Getting
              Started' lessons on the Learn tab and it will start to fill in.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => setShowGettingStartedPopup(false)}
              className="bg-[#fd992d] text-white hover:bg-[#d73356]"
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {editingItem && (
        <EditItemModal
          item={editingItem.item}
          type={editingItem.type}
          subtypes={subtypes}
          onClose={() => setEditingItem(null)}
          onSave={handleEditItem}
        />
      )}
    </div>
  );
};
