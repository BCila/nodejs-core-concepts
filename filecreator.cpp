#include <iostream>
#include <string>
#include <fstream>

int main()
{
	bool exit = false;
	while(!exit)
	{
		std::string name;
		std::string content;
		std::ofstream outfile;

		int option;

		std::cout << "Menu:" << std::endl;
		std::cout << "[1] Create a new file" << std::endl;
		std::cout << "[2] Exit" << std::endl;

		std::cout << "FileCreator > Please choose an option: ";
		std::cin >> option;

		switch (option)
		{
			case 1:
				std::cout << "FileCreator > Enter the name of the file: ";
				std::cin >> name;
			
				std::cin.ignore();
				std::cout << "FileCreator > Enter the content of the file: ";
				std::getline(std::cin, content);

				outfile.open(name);
				outfile << content << std::endl;
				outfile.close();

				std::cout << "The file was created successfully!" << std::endl;
				break;
			case 2:
				std::cout << "Exiting out of the application..." << std::endl;
				exit = true;
				break;
		}
	}
}
