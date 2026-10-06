'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const store = require('../src/store/dataStore');

test('deleteCard removes a card by its id', () => {
  const originalDataFile = process.env.DATA_FILE;
  const tempFile = './server/test/delete-card-test-data.json';

  process.env.DATA_FILE = tempFile;

  try {
    const board = {
      id: 'board-test',
      title: 'Test Board',
      columns: [
        {
          id: 'col-test',
          title: 'Backlog',
          cards: [
            {
              id: 'card-123',
              title: 'Test Card',
              description: 'Delete me',
            },
            {
              id: 'card-456',
              title: 'Keep Card',
              description: 'Keep me',
            },
          ],
        },
      ],
    };

    store.writeData([board]);

    const result = store.deleteCard(
      'board-test',
      'col-test',
      'card-123'
    );

    assert.deepEqual(result, { ok: true });

    const updatedBoard = store.getBoard('board-test');

    assert.equal(updatedBoard.columns[0].cards.length, 1);
    assert.equal(updatedBoard.columns[0].cards[0].id, 'card-456');
  } finally {
    const fs = require('fs');

    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }

    if (originalDataFile === undefined) {
      delete process.env.DATA_FILE;
    } else {
      process.env.DATA_FILE = originalDataFile;
    }
  }
});
