#!/bin/sh
# this script performs gradle clean task, build task, and ship to a gcp
GREEN='\033[0;32m'
RED='\033[0;31m'
WHITE='\033[1;37m'
YELLOW='\033[1;33m'
NC='\033[0m'
BOLD='\033[1m'

APPLICATION='discovery-service-0.0.1-SNAPSHOT.jar'

echo -e "${GREEN}${BOLD}------------------------------   WE ARE THE BUILDERS-AND-K'ERS   ------------------------------${NC}"
echo ""
read -p "Hello, Chief Build-and-K here. Where do you want us to build and k this baby today? (dev, qa) " environment
read -p "What do you say? Skip tests? (yes, no) " skipTest
echo -e "${YELLOW}${BOLD}Excellent choice. Let us begin${NC}"
echo "*****************************"
echo -e "${YELLOW}${BOLD}>>> A little house keeping doesn't hurt....${NC}"
echo ""
./gradlew clean
echo ""
echo -e "${YELLOW}${BOLD}>>> Assembling my troop of monkeys we build this thing....${NC}"
echo ""
if [ $skipTest = "no" ]; then
    ./gradlew build
else
    ./gradlew build -x test
fi
echo ""
echo -e "${YELLOW}${BOLD}>>> Built. Using a monkey to ship to : $environment ${NC}"
if [ $environment = "dev" ]; then
	scp build/libs/${APPLICATION} olanga@syhos-dev.sycomafrica.com:~
elif [ $environment = "qa" ]; then
	scp build/libs/${APPLICATION} olanga@syhos-qa.sycomafrica.com:~
else
	echo -e "${RED}${BOLD}Ummmm! I don't know where exactly that is${NC}"
fi
echo -e "${GREEN}${BOLD}All done, Sir${NC}"
echo -e "${GREEN}${BOLD}-----------------------------------------------------------------------------------------------"
