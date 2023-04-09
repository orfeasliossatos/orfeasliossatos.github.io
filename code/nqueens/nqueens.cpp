#include <iostream>
#include <vector>

using namespace std;

int main(int argc, char *argv[])
{
	vector<int> v = {0, 1, 2};
	for (auto &v_i : v) {
		cout << v_i << endl;
	}
}
