"use client";

import { useMemo, useState } from "react";
import { JobCard } from "@/components/jobs/job-card";
import { Button } from "@/components/ui/button";
import type { EmploymentType, Job, WorkplaceType } from "@/lib/jobs";

type Filters = {
  keyword: string;
  location: string;
  employmentType: EmploymentType | "";
  workplaceType: WorkplaceType | "";
  industry: string;
};

const initialFilters: Filters = {
  keyword: "",
  location: "",
  employmentType: "",
  workplaceType: "",
  industry: "",
};

const controlStyles = "mt-2 min-h-12 w-full rounded-[var(--radius)] border border-border-grey bg-white px-3 py-2 text-slate shadow-sm focus:border-green focus:ring-3 focus:ring-green/15";

function uniqueValues(values: string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

export function JobsBrowser({ jobs }: { jobs: Job[] }) {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const locations = useMemo(() => uniqueValues(jobs.map((job) => job.location)), [jobs]);
  const employmentTypes = useMemo(() => uniqueValues(jobs.map((job) => job.employmentType)), [jobs]);
  const workplaceTypes = useMemo(() => uniqueValues(jobs.map((job) => job.workplaceType)), [jobs]);
  const industries = useMemo(() => uniqueValues(jobs.map((job) => job.industry)), [jobs]);

  const filteredJobs = useMemo(() => {
    const keyword = filters.keyword.trim().toLocaleLowerCase();

    return jobs.filter((job) => {
      const keywordFields = [job.title, job.industry, job.location, job.organisationDisplayName, job.summary]
        .join(" ")
        .toLocaleLowerCase();

      return (
        (!keyword || keywordFields.includes(keyword)) &&
        (!filters.location || job.location === filters.location) &&
        (!filters.employmentType || job.employmentType === filters.employmentType) &&
        (!filters.workplaceType || job.workplaceType === filters.workplaceType) &&
        (!filters.industry || job.industry === filters.industry)
      );
    });
  }, [filters, jobs]);

  if (jobs.length === 0) {
    return null;
  }

  const clearFilters = () => setFilters(initialFilters);

  return (
    <section className="bg-white" aria-labelledby="verified-opportunities-heading">
      <div className="mx-auto w-full max-w-[var(--page-max-width)] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <h2 id="verified-opportunities-heading" className="text-3xl font-extrabold text-navy sm:text-4xl">Verified opportunities</h2>
        <form className="mt-8 rounded-[var(--radius)] border border-border-grey bg-soft-grey p-5 sm:p-6" onSubmit={(event) => event.preventDefault()}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <label className="font-bold text-navy">
              Keyword
              <input
                className={controlStyles}
                type="search"
                value={filters.keyword}
                onChange={(event) => setFilters((current) => ({ ...current, keyword: event.target.value }))}
              />
            </label>
            <FilterSelect label="Location" value={filters.location} options={locations} onChange={(location) => setFilters((current) => ({ ...current, location }))} />
            <FilterSelect label="Employment type" value={filters.employmentType} options={employmentTypes} onChange={(employmentType) => setFilters((current) => ({ ...current, employmentType: employmentType as Filters["employmentType"] }))} />
            <FilterSelect label="Workplace type" value={filters.workplaceType} options={workplaceTypes} onChange={(workplaceType) => setFilters((current) => ({ ...current, workplaceType: workplaceType as Filters["workplaceType"] }))} />
            <FilterSelect label="Industry" value={filters.industry} options={industries} onChange={(industry) => setFilters((current) => ({ ...current, industry }))} />
          </div>
          <div className="mt-5"><Button variant="outline" onClick={clearFilters}>Clear Filters</Button></div>
        </form>

        {filteredJobs.length > 0 ? (
          <ul className="mt-8 grid gap-5 lg:grid-cols-2">
            {filteredJobs.map((job) => <li key={job.id}><JobCard job={job} /></li>)}
          </ul>
        ) : (
          <div className="mt-8 rounded-[var(--radius)] border border-border-grey bg-soft-grey p-6 sm:p-8" role="status">
            <h3 className="text-2xl font-extrabold text-navy">No opportunities match your filters</h3>
            <p className="mt-3 leading-7 text-slate">Try adjusting your search terms or clearing one or more filters.</p>
            <div className="mt-6"><Button onClick={clearFilters}>Clear Filters</Button></div>
          </div>
        )}
      </div>
    </section>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className="font-bold text-navy">
      {label}
      <select className={controlStyles} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">All</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
