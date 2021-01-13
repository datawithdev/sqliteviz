import { expect } from 'chai'
import { mutations, actions } from '@/store'
const {
  saveSchema,
  updateTab,
  deleteTab,
  setCurrentTabId,
  setCurrentTab,
  updatePredefinedQueries
} = mutations

const { addTab } = actions

describe('mutations', () => {
  it('saveSchema', () => {
    // mock state
    const state = {}

    const schema = [
      {
        name: 'table1',
        columns: [
          { name: 'id', type: 'INTEGER' }
        ]
      }
    ]
    saveSchema(state, {
      dbName: 'test',
      schema
    })
    expect(state.dbName).to.equal('test')
    expect(state.schema).to.eql(schema)
  })

  it('updateTab (save)', () => {
    const tab = {
      id: 1,
      name: 'test',
      tempName: null,
      query: 'SELECT * from foo',
      chart: {},
      isUnsaved: true,
      isPredefined: false
    }

    const newTab = {
      index: 0,
      id: 1,
      name: 'new test',
      query: 'SELECT * from bar',
      isUnsaved: false
    }

    // mock state
    const state = {
      tabs: [tab]
    }

    updateTab(state, newTab)
    expect(state.tabs[0].id).to.equal(1)
    expect(state.tabs[0].name).to.equal('new test')
    expect(state.tabs[0].tempName).to.equal(null)
    expect(state.tabs[0].query).to.equal('SELECT * from bar')
    expect(state.tabs[0].isUnsaved).to.equal(false)
  })

  it('updateTab (save predefined)', () => {
    const tab = {
      id: 1,
      name: 'test',
      tempName: null,
      query: 'SELECT * from foo',
      chart: {},
      isUnsaved: true,
      isPredefined: true
    }

    const newTab = {
      index: 0,
      id: 2,
      name: 'new test',
      query: 'SELECT * from bar',
      chart: {},
      isUnsaved: false
    }

    // mock state
    const state = {
      tabs: [tab],
      currentTabId: 1
    }

    updateTab(state, newTab)
    expect(state.tabs).to.have.lengthOf(1)
    expect(state.currentTabId).to.equal(2)
    expect(state.tabs[0].id).to.equal(2)
    expect(state.tabs[0].name).to.equal('new test')
    expect(state.tabs[0].query).to.equal('SELECT * from bar')
    expect(state.tabs[0].isUnsaved).to.equal(false)
    expect(state.tabs[0].isPredefined).to.equal(undefined)
  })

  it('updateTab (rename)', () => {
    const tab = {
      id: 1,
      name: 'test',
      tempName: null,
      query: 'SELECT * from foo',
      chart: {},
      isUnsaved: true
    }

    const newTab = {
      index: 0,
      id: 1,
      name: 'new test'
    }

    // mock state
    const state = {
      tabs: [tab]
    }

    updateTab(state, newTab)
    expect(state.tabs).to.have.lengthOf(1)
    expect(state.tabs[0].id).to.equal(1)
    expect(state.tabs[0].name).to.equal('new test')
    expect(state.tabs[0].query).to.equal('SELECT * from foo')
    expect(state.tabs[0].isUnsaved).to.equal(true)
  })

  it('updateTab (changes detected)', () => {
    const tab = {
      id: 1,
      name: 'test',
      tempName: null,
      query: 'SELECT * from foo',
      chart: {},
      isUnsaved: false,
      isPredefined: true
    }

    const newTab = {
      index: 0,
      isUnsaved: true
    }

    // mock state
    const state = {
      tabs: [tab]
    }

    updateTab(state, newTab)
    expect(state.tabs).to.have.lengthOf(1)
    expect(state.tabs[0].id).to.equal(1)
    expect(state.tabs[0].name).to.equal('test')
    expect(state.tabs[0].query).to.equal('SELECT * from foo')
    expect(state.tabs[0].isUnsaved).to.equal(true)
  })

  it('deleteTab (opened, first)', () => {
    const tab1 = {
      id: 1,
      name: 'foo',
      tempName: null,
      query: 'SELECT * from foo',
      chart: {},
      isUnsaved: false
    }

    const tab2 = {
      id: 2,
      name: 'bar',
      tempName: null,
      query: 'SELECT * from bar',
      chart: {},
      isUnsaved: false
    }

    // mock state
    const state = {
      tabs: [tab1, tab2],
      currentTabId: 1
    }

    deleteTab(state, 0)
    expect(state.tabs).to.have.lengthOf(1)
    expect(state.tabs[0].id).to.equal(2)
    expect(state.currentTabId).to.equal(2)
  })

  it('deleteTab (opened, last)', () => {
    const tab1 = {
      id: 1,
      name: 'foo',
      tempName: null,
      query: 'SELECT * from foo',
      chart: {},
      isUnsaved: false
    }

    const tab2 = {
      id: 2,
      name: 'bar',
      tempName: null,
      query: 'SELECT * from bar',
      chart: {},
      isUnsaved: false
    }

    // mock state
    const state = {
      tabs: [tab1, tab2],
      currentTabId: 2
    }

    deleteTab(state, 1)
    expect(state.tabs).to.have.lengthOf(1)
    expect(state.tabs[0].id).to.equal(1)
    expect(state.currentTabId).to.equal(1)
  })

  it('deleteTab (opened, in the middle)', () => {
    const tab1 = {
      id: 1,
      name: 'foo',
      tempName: null,
      query: 'SELECT * from foo',
      chart: {},
      isUnsaved: false
    }

    const tab2 = {
      id: 2,
      name: 'bar',
      tempName: null,
      query: 'SELECT * from bar',
      chart: {},
      isUnsaved: false
    }

    const tab3 = {
      id: 3,
      name: 'foobar',
      tempName: null,
      query: 'SELECT * from foobar',
      chart: {},
      isUnsaved: false
    }

    // mock state
    const state = {
      tabs: [tab1, tab2, tab3],
      currentTabId: 2
    }

    deleteTab(state, 1)
    expect(state.tabs).to.have.lengthOf(2)
    expect(state.tabs[0].id).to.equal(1)
    expect(state.tabs[1].id).to.equal(3)
    expect(state.currentTabId).to.equal(3)
  })

  it('deleteTab (opened, single)', () => {
    const tab1 = {
      id: 1,
      name: 'foo',
      tempName: null,
      query: 'SELECT * from foo',
      chart: {},
      isUnsaved: false
    }

    // mock state
    const state = {
      tabs: [tab1],
      currentTabId: 1
    }

    deleteTab(state, 0)
    expect(state.tabs).to.have.lengthOf(0)
    expect(state.currentTabId).to.equal(null)
  })

  it('deleteTab (not opened)', () => {
    const tab1 = {
      id: 1,
      name: 'foo',
      tempName: null,
      query: 'SELECT * from foo',
      chart: {},
      isUnsaved: false
    }

    const tab2 = {
      id: 2,
      name: 'bar',
      tempName: null,
      query: 'SELECT * from bar',
      chart: {},
      isUnsaved: false
    }

    // mock state
    const state = {
      tabs: [tab1, tab2],
      currentTabId: 1
    }

    deleteTab(state, 1)
    expect(state.tabs).to.have.lengthOf(1)
    expect(state.tabs[0].id).to.equal(1)
    expect(state.currentTabId).to.equal(1)
  })

  it('setCurrentTabId', () => {
    // mock state
    const state = {
      currentTabId: 1
    }

    setCurrentTabId(state, 2)
    expect(state.currentTabId).to.equal(2)
  })

  it('setCurrentTab', () => {
    // mock state
    const state = {
      currentTab: { id: 1 }
    }

    setCurrentTab(state, { id: 2 })
    expect(state.currentTab).to.eql({ id: 2 })
  })

  it('updatePredefinedQueries (single)', () => {
    const query = {
      id: 1,
      name: 'foo',
      query: 'SELECT * FROM foo',
      chart: {},
      createdAt: '2020-11-07T20:57:04.492Z'
    }

    const state = {
      predefinedQueries: []
    }

    updatePredefinedQueries(state, query)
    expect(state.predefinedQueries).to.eql([query])
  })

  it('updatePredefinedQueries (array)', () => {
    const queries = [{
      id: 1,
      name: 'foo',
      query: 'SELECT * FROM foo',
      chart: {},
      createdAt: '2020-11-07T20:57:04.492Z'
    },
    {
      id: 2,
      name: 'bar',
      query: 'SELECT * FROM bar',
      chart: {},
      createdAt: '2020-11-07T20:57:04.492Z'
    }]

    const state = {
      predefinedQueries: []
    }

    updatePredefinedQueries(state, queries)
    expect(state.predefinedQueries).to.eql(queries)
  })
})

describe('actions', () => {
  it('addTab (new)', async () => {
    // mock state
    const state = {
      tabs: [],
      untitledLastIndex: 0
    }

    const id = await addTab({ state })
    expect(state.tabs[0].id).to.eql(id)
    expect(state.tabs[0].name).to.eql(null)
    expect(state.tabs[0].tempName).to.eql('Untitled')
    expect(state.tabs[0].isUnsaved).to.eql(true)
    expect(state.untitledLastIndex).to.equal(1)
  })

  it('addTab (saved)', async () => {
    // mock state
    const state = {
      tabs: [],
      untitledLastIndex: 0
    }
    const tab = {
      id: 1,
      name: 'test',
      tempName: null,
      query: 'SELECT * from foo',
      chart: {},
      isUnsaved: false
    }
    await addTab({ state }, tab)
    expect(state.tabs[0]).to.eql(tab)
    expect(state.untitledLastIndex).to.equal(0)
  })

  it('addTab (existed)', async () => {
    const tab1 = {
      id: 1,
      name: 'test',
      tempName: null,
      query: 'SELECT * from foo',
      chart: {},
      isUnsaved: false
    }

    const tab2 = {
      id: 2,
      name: 'bar',
      tempName: null,
      query: 'SELECT * from bar',
      chart: {},
      isUnsaved: false
    }

    // mock state
    const state = {
      tabs: [tab1, tab2],
      untitledLastIndex: 0
    }

    await addTab({ state }, tab1)
    expect(state.tabs).to.have.lengthOf(2)
    expect(state.untitledLastIndex).to.equal(0)
  })
})