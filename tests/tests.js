QUnit.module('Basics');

QUnit.test('CanvasLife available', function(assert) {
  assert.ok(CanvasLife !== undefined);
});

QUnit.test('Options settings with defaults', function(assert) {
  var universe = document.getElementById('universe')
    , life;      
    
  life = CanvasLife(universe, {});
  assert.deepEqual(life.options, life.defaultOptions,
    'Expect defaults to be used');
    
  life = CanvasLife(universe);
  assert.deepEqual(life.options, life.defaultOptions,
    'options are optional in constructor');
  
  life = CanvasLife(universe, {a: 'b'});
  assert.notOk('a' in life.options, 'Option key must be defined in defaults');
  
  life = CanvasLife(universe, {aliveValue: 0x1});
  assert.equal(life.options.aliveValue, 0x1, 'Can override default option');
});
