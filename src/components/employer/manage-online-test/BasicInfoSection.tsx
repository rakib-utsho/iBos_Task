"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FiChevronDown, FiClock, FiEdit2 } from "react-icons/fi";
import { questionTypeBasicOptions } from "./constants";
import { BasicInfo, BasicQuestionType } from "./types";

const inputClassName =
  "h-11 w-full rounded-lg border border-(--akij-border) bg-white px-3 text-sm text-(--akij-text) outline-none transition focus:border-(--akij-btn-start) focus:ring-2 focus:ring-(--akij-btn-start)/20";

type BasicInfoFormProps = {
  value: BasicInfo;
  onChange: (next: BasicInfo) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function BasicInfoForm({ value, onChange, onSave, onCancel }: BasicInfoFormProps) {
  return (
    <>
      <Card className="mx-auto mt-6 max-w-4xl gap-0 rounded-2xl border border-(--akij-border) bg-white py-0 shadow-none">
        <CardContent className="space-y-5 p-5 sm:p-7">
          <h3 className="text-2xl font-semibold text-(--akij-heading)">Basic Information</h3>

          <div>
            <label className="mb-1.5 block text-sm text-(--akij-heading)">Online Test Title *</label>
            <input
              className={inputClassName}
              placeholder="Enter online test title"
              value={value.title}
              onChange={(event) => onChange({ ...value, title: event.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-(--akij-heading)">Total Candidates *</label>
              <input
                className={inputClassName}
                placeholder="Enter total candidates"
                value={value.candidates}
                onChange={(event) => onChange({ ...value, candidates: event.target.value })}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-(--akij-heading)" htmlFor="total-slots">
                Total Slots *
              </label>
              <div className="relative">
                <select
                  id="total-slots"
                  className={`${inputClassName} appearance-none pr-9`}
                  value={value.slots}
                  onChange={(event) => onChange({ ...value, slots: event.target.value })}
                >
                  <option value="" disabled>
                    Select total slots
                  </option>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-(--akij-subtext)" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-(--akij-heading)" htmlFor="total-question-set">
                Total Question Set *
              </label>
              <div className="relative">
                <select
                  id="total-question-set"
                  className={`${inputClassName} appearance-none pr-9`}
                  value={value.questionSet}
                  onChange={(event) => onChange({ ...value, questionSet: event.target.value })}
                >
                  <option value="" disabled>
                    Select total question set
                  </option>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-(--akij-subtext)" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-(--akij-heading)" htmlFor="question-type">
                Question Type *
              </label>
              <div className="relative">
                <select
                  id="question-type"
                  className={`${inputClassName} appearance-none pr-9`}
                  value={value.questionType}
                  onChange={(event) =>
                    onChange({ ...value, questionType: event.target.value as BasicQuestionType })
                  }
                >
                  {questionTypeBasicOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-(--akij-subtext)" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_1fr_130px]">
            <div>
              <label className="mb-1.5 block text-sm text-(--akij-heading)" htmlFor="start-time">
                Start Time *
              </label>
              <div className="relative">
                <input
                  id="start-time"
                  type="time"
                  className={`${inputClassName} pr-9`}
                  value={value.startTime}
                  onChange={(event) => onChange({ ...value, startTime: event.target.value })}
                />
                <FiClock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-(--akij-subtext)" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-(--akij-heading)" htmlFor="end-time">
                End Time *
              </label>
              <div className="relative">
                <input
                  id="end-time"
                  type="time"
                  className={`${inputClassName} pr-9`}
                  value={value.endTime}
                  onChange={(event) => onChange({ ...value, endTime: event.target.value })}
                />
                <FiClock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-(--akij-subtext)" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-(--akij-heading)">Duration</label>
              <input
                className={inputClassName}
                placeholder="Duration"
                value={value.duration}
                onChange={(event) => onChange({ ...value, duration: event.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mx-auto mt-4 max-w-4xl gap-0 rounded-2xl border border-(--akij-border) bg-white py-0 shadow-none">
        <CardContent className="flex items-center justify-between p-4">
          <Button
            type="button"
            variant="outline"
            className="h-11 min-w-30 rounded-xl border-(--akij-border) bg-white text-(--akij-heading)"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="h-11 min-w-42.5 rounded-xl bg-linear-to-r from-(--akij-btn-start) to-(--akij-btn-end) text-base font-semibold text-white"
            onClick={onSave}
          >
            Save & Continue
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

type BasicInfoSummaryProps = {
  value: BasicInfo;
  onEdit: () => void;
  onContinue: () => void;
};

export function BasicInfoSummary({ value, onEdit, onContinue }: BasicInfoSummaryProps) {
  return (
    <>
      <Card className="mx-auto mt-6 max-w-4xl gap-0 rounded-2xl border border-(--akij-border) bg-white py-0 shadow-none">
        <CardContent className="space-y-5 p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl font-semibold text-(--akij-heading)">Basic Information</h3>
            <Button
              type="button"
              variant="ghost"
              className="h-auto p-0 text-sm font-semibold text-(--akij-btn-start) hover:bg-transparent"
              onClick={onEdit}
            >
              <FiEdit2 className="mr-1 size-4" /> Edit
            </Button>
          </div>

          <div>
            <p className="text-sm text-(--akij-subtext)">Online Test Title</p>
            <p className="mt-1 text-lg font-semibold text-(--akij-heading)">{value.title}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <p className="text-sm text-(--akij-subtext)">Total Candidates</p>
              <p className="mt-1 text-lg font-semibold text-(--akij-heading)">{value.candidates}</p>
            </div>
            <div>
              <p className="text-sm text-(--akij-subtext)">Total Slots</p>
              <p className="mt-1 text-lg font-semibold text-(--akij-heading)">{value.slots}</p>
            </div>
            <div>
              <p className="text-sm text-(--akij-subtext)">Total Question Set</p>
              <p className="mt-1 text-lg font-semibold text-(--akij-heading)">{value.questionSet}</p>
            </div>
            <div>
              <p className="text-sm text-(--akij-subtext)">Duration Per Slots (Minutes)</p>
              <p className="mt-1 text-lg font-semibold text-(--akij-heading)">{value.duration || "-"}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-(--akij-subtext)">Question Type</p>
            <p className="mt-1 text-lg font-semibold text-(--akij-heading)">{value.questionType}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mx-auto mt-4 max-w-4xl gap-0 rounded-2xl border border-(--akij-border) bg-white py-0 shadow-none">
        <CardContent className="flex items-center justify-between p-4">
          <Button
            type="button"
            variant="outline"
            className="h-11 min-w-30 rounded-xl border-(--akij-border) bg-white text-(--akij-heading)"
            onClick={onEdit}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="h-11 min-w-42.5 rounded-xl bg-linear-to-r from-(--akij-btn-start) to-(--akij-btn-end) text-base font-semibold text-white"
            onClick={onContinue}
          >
            Save & Continue
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
