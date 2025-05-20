
class stack {
	data;
	pos;
	alloced;
}

function stack__new(alloced)
{
	var self;
	struct(self, stack);
	self = new stack();
	self.data = array(alloced);
	self.alloced = alloced;
	self.pos = 0;
	return self;
}

function stack__dispose(self)
{
	struct(self, stack);
	free(self.data);
	free(self);
}

function stack__push(self, element)
{
	struct(self, stack);
	var i,new_array;
	struct(new_array, stack);

	switch (self.pos >= self.alloced) {
	case true:
		self.alloced = self.pos + 32;
		new_array = array(self.alloced);
		i = 0;
		while (i < self.pos) {
			new_array[i] = self.data[i];
			i = i + 1;
		}
		free(self.data);
		self.data = new_array;
	}
	self.data[self.pos] = element;
	self.pos = self.pos + 1;
}

function stack__pop(self)
{
	struct(self, stack);
	switch (self.pos <= 0) {
	case true:
		return null;
	}
	self.pos = self.pos - 1;
	return self.data[self.pos];
}

function stack__top(self)
{
	struct(self, stack);
	switch (self.pos <= 0) {
	case true:
		return null;
	}
	return self.data[self.pos - 1];
}


exporting([
	stack,
	stack__new,
	stack__dispose,
	stack__push,
	stack__pop,
	stack__top,
]);

