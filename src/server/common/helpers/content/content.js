import path from 'node:path'
import { readdirSync, readFileSync } from 'node:fs'
import Joi from 'joi'
import { parse } from 'yaml'

import { config } from '#/config/config.js'
import { renderMarkdown } from './markdown.js'

const contentDir = path.join(config.get('root'), 'src/content')

const missionSchema = Joi.object({
  number: Joi.number().integer().min(0).required(),
  slug: Joi.string()
    .pattern(/^[a-z0-9-]+$/)
    .required(),
  title: Joi.string().required(),
  badge: Joi.string().required(),
  time: Joi.string().required(),
  build: Joi.string().required(),
  learn: Joi.string().required(),
  team: Joi.string().required(),
  checks: Joi.array().items(Joi.string()).min(1).required(),
  huddle: Joi.string().required(),
  lead: Joi.array().items(Joi.string()).required(),
  setup: Joi.boolean().default(false),
  stuck: Joi.array()
    .items(
      Joi.object({
        problem: Joi.string().required(),
        fix: Joi.string().required()
      })
    )
    .default([]),
  stage: Joi.string().valid('Get set up', 'Plan', 'Build', 'Finish').required(),
  summary: Joi.string().required()
})

const frontMatterPattern = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

let missionsCache
let professionsCache
let glossaryCache
let teamCache
let setupStepsCache

/**
 * Splits a markdown file into its YAML front matter and markdown body.
 * @param {string} source
 * @param {string} fileName
 */
export function parseFrontMatter(source, fileName) {
  const match = frontMatterPattern.exec(source)

  if (!match) {
    throw new Error(`${fileName} has no front matter`)
  }

  return { data: parse(match[1]), body: match[2] }
}

function readContentFile(...segments) {
  return readFileSync(path.join(contentDir, ...segments), 'utf-8')
}

function loadMission(fileName) {
  const { data, body } = parseFrontMatter(
    readContentFile('missions', fileName),
    fileName
  )
  const { error, value } = missionSchema.validate(data)

  if (error) {
    throw new Error(`${fileName}: ${error.message}`)
  }

  return {
    ...value,
    html: renderMarkdown(body),
    stuck: renderStuck(value.stuck)
  }
}

/**
 * All missions, in order. Content is read once and then cached.
 */
export function getMissions() {
  missionsCache ??= readdirSync(path.join(contentDir, 'missions'))
    .filter((fileName) => fileName.endsWith('.md'))
    .map(loadMission)
    .sort((a, b) => a.number - b.number)

  return missionsCache
}

export function getMission(slug) {
  return getMissions().find((mission) => mission.slug === slug)
}

export function getNextMission(slug) {
  const missions = getMissions()
  const index = missions.findIndex((mission) => mission.slug === slug)

  return index === -1 ? undefined : missions.at(index + 1)
}

export function getProfessions() {
  professionsCache ??= parse(readContentFile('professions.yml'))

  return professionsCache
}

export function getProfession(id) {
  return getProfessions().find((profession) => profession.id === id)
}

export function getTeam() {
  teamCache ??= parse(readContentFile('team.yml'))

  return teamCache
}

const stuckSchema = Joi.array()
  .items(
    Joi.object({
      problem: Joi.string().required(),
      fix: Joi.string().required()
    })
  )
  .default([])

const setupStepSchema = Joi.object({
  number: Joi.number().integer().min(1).required(),
  slug: Joi.string()
    .pattern(/^[a-z0-9-]+$/)
    .required(),
  title: Joi.string().required(),
  time: Joi.string().required(),
  see: Joi.string().required(),
  stuck: stuckSchema
})

function loadSetupStep(fileName) {
  const { data, body } = parseFrontMatter(
    readContentFile('setup', 'steps', fileName),
    fileName
  )
  const { error, value } = setupStepSchema.validate(data)

  if (error) {
    throw new Error(`${fileName}: ${error.message}`)
  }

  return {
    ...value,
    html: renderMarkdown(body),
    stuck: renderStuck(value.stuck)
  }
}

/**
 * Help items rendered to safe HTML, so fixes can contain links.
 */
function renderStuck(stuck) {
  return stuck.map(({ problem, fix }) => ({
    problem,
    fixHtml: renderMarkdown(fix)
  }))
}

/**
 * The step-by-step setup journey for Mission 0, in order.
 */
export function getSetupSteps() {
  setupStepsCache ??= readdirSync(path.join(contentDir, 'setup', 'steps'))
    .filter((fileName) => fileName.endsWith('.md'))
    .map(loadSetupStep)
    .sort((a, b) => a.number - b.number)

  return setupStepsCache
}

export function getSetupStep(slug) {
  return getSetupSteps().find((step) => step.slug === slug)
}

const otherSetupPages = { 'desktop-app': 'desktop', terminal: 'terminal' }

/**
 * Setup guides for people who use technical tools.
 * @param {string} id - 'desktop-app' or 'terminal'
 */
export function getOtherSetupPage(id) {
  const fileName = otherSetupPages[id]

  if (!fileName) {
    return undefined
  }

  const { data, body } = parseFrontMatter(
    readContentFile('setup', 'other', `${fileName}.md`),
    `${fileName}.md`
  )

  return { id, title: data.title, html: renderMarkdown(body) }
}

export function getGlossary() {
  glossaryCache ??= parse(readContentFile('glossary.yml'))

  return glossaryCache
}

/**
 * A standalone content page from src/content/pages, rendered to safe HTML.
 * @param {string} name
 */
export function getPageHtml(name) {
  return renderMarkdown(readContentFile('pages', `${name}.md`))
}
