import React from 'react';
import { Link } from 'react-router-dom';
import SeoMeta from '../components/SeoMeta';
import Breadcrumb from '../components/Breadcrumb';
import { useSiteText } from '../context/PublicContentContext';
import { mailHref, telHref } from '../lib/contact';
import { POLICIES, POLICY_LIST, POLICY_UPDATED } from '../data/policies';

/**
 * One policy page (Privacy, Terms, Cancellation & Refunds, Shipping & Delivery): <Policy kind="privacy" />.
 * The texts are in src/data/policies.js; company details come from Page Content → Company & Contact.
 */
export const Policy = ({ kind }) => {
  const company = useSiteText('company');
  const policy = POLICIES[kind];

  return (
    <div className="pt-28 pb-24">
      <SeoMeta title={policy.title} description={policy.intro(company).slice(0, 160)} />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: policy.title }]} />

        <header className="pt-4 pb-8 sm:pb-10 border-b border-line">
          <h1 className="text-[32px] sm:text-[44px] font-semibold tracking-[-0.03em] leading-[1.1] text-fg">
            {policy.title}
          </h1>
          <p className="mt-3 text-[13px] text-subtle">Last updated: {POLICY_UPDATED}</p>
          <p className="mt-5 text-[16px] sm:text-[17px] text-muted leading-relaxed">{policy.intro(company)}</p>
        </header>

        <div className="py-8 sm:py-10 space-y-9">
          {policy.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-[19px] sm:text-[21px] font-semibold tracking-tight text-fg mb-3">{s.heading}</h2>
              {s.body?.(company).map((p) => (
                <p key={p} className="text-[15px] sm:text-[16px] text-muted leading-relaxed mb-3">{p}</p>
              ))}
              {s.items && (
                <ul className="list-disc pl-5 space-y-2 text-[15px] sm:text-[16px] text-muted leading-relaxed marker:text-accent">
                  {s.items(company).map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
              {s.links && (
                <ul className="mt-2 space-y-1.5">
                  {s.links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="text-[15px] text-accent hover:underline underline-offset-4">{l.text}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Who we are: Razorpay checks that the business name, address and contact are on the policy pages */}
        <aside className="rounded-2xl border border-line bg-surface/60 p-6 sm:p-7 text-[14px] sm:text-[15px] text-muted leading-relaxed">
          <h2 className="text-[15px] font-semibold text-fg mb-2">Contact us</h2>
          <p className="font-medium text-fg/90">{company.companyName}</p>
          {(company.registeredOffice || company.officeAddress) && <p>{company.registeredOffice || company.officeAddress}</p>}
          <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
            {company.email && <a href={mailHref(company.email)} className="hover:text-fg">{company.email}</a>}
            {company.phonePrimary && <a href={telHref(company.phonePrimary)} className="hover:text-fg tabular-nums">{company.phonePrimary}</a>}
          </p>
          {(company.gstin || company.cin) && (
            <p className="mt-2 text-[13px] text-subtle tabular-nums">
              {[company.gstin && `GSTIN: ${company.gstin}`, company.cin && `CIN: ${company.cin}`].filter(Boolean).join(' · ')}
            </p>
          )}
        </aside>

        <nav aria-label="Other policies" className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
          {POLICY_LIST.filter((p) => p !== policy).map((p) => (
            <Link key={p.path} to={p.path} className="text-muted hover:text-fg">{p.title}</Link>
          ))}
        </nav>
      </article>
    </div>
  );
};

export default Policy;
