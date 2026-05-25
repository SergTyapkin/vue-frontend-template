# Цвета текста
BLACK='\033[0;30m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[0;37m'

# Яркие цвета
BLACK_BOLD='\033[1;30m'
RED_BOLD='\033[1;31m'
GREEN_BOLD='\033[1;32m'
YELLOW_BOLD='\033[1;33m'
BLUE_BOLD='\033[1;34m'
MAGENTA_BOLD='\033[1;35m'
CYAN_BOLD='\033[1;36m'
WHITE_BOLD='\033[1;37m'

# Фоновые цвета
BG_BLACK='\033[40m'
BG_RED='\033[41m'
BG_GREEN='\033[42m'
BG_YELLOW='\033[43m'
BG_BLUE='\033[44m'
BG_MAGENTA='\033[45m'
BG_CYAN='\033[46m'
BG_WHITE='\033[47m'

# Стили текста
BOLD='\033[1m'
DIM='\033[2m'
UNDERLINE='\033[4m'
BLINK='\033[5m'
REVERSE='\033[7m'
HIDDEN='\033[8m'

# Сброс
NO_COLOR='\033[0m' # No Color

# Функции для вывода
echo_black() { echo -e "${BLACK}$*${NO_COLOR}"; }
echo_red() { echo -e "${RED}$*${NO_COLOR}"; }
echo_green() { echo -e "${GREEN}$*${NO_COLOR}"; }
echo_yellow() { echo -e "${YELLOW}$*${NO_COLOR}"; }
echo_blue() { echo -e "${BLUE}$*${NO_COLOR}"; }
echo_magenta() { echo -e "${MAGENTA}$*${NO_COLOR}"; }
echo_cyan() { echo -e "${CYAN}$*${NO_COLOR}"; }
echo_white() { echo -e "${WHITE}$*${NO_COLOR}"; }

# Яркие цвета
echo_black_bold() { echo -e "${BLACK_BOLD}$*${NO_COLOR}"; }
echo_red_bold() { echo -e "${RED_BOLD}$*${NO_COLOR}"; }
echo_green_bold() { echo -e "${GREEN_BOLD}$*${NO_COLOR}"; }
echo_yellow_bold() { echo -e "${YELLOW_BOLD}$*${NO_COLOR}"; }
echo_blue_bold() { echo -e "${BLUE_BOLD}$*${NO_COLOR}"; }
echo_magenta_bold() { echo -e "${MAGENTA_BOLD}$*${NO_COLOR}"; }
echo_cyan_bold() { echo -e "${CYAN_BOLD}$*${NO_COLOR}"; }
echo_white_bold() { echo -e "${WHITE_BOLD}$*${NO_COLOR}"; }

# Стилизованный вывод
echo_error() { echo -e "${RED_BOLD}❌ ERROR:${NO_COLOR} ${RED}$*${NO_COLOR}"; }
echo_success() { echo -e "${GREEN_BOLD}✅ SUCCESS:${NO_COLOR} ${GREEN}$*${NO_COLOR}"; }
echo_warn() { echo -e "${YELLOW_BOLD}⚠ WARNING:${NO_COLOR} ${YELLOW}$*${NO_COLOR}"; }
echo_info() { echo -e "${CYAN_BOLD}ℹ INFO:${NO_COLOR} ${CYAN}$*${NO_COLOR}"; }
echo_debug() { echo -e "${DIM}${CYAN}🔍 DEBUG:${NO_COLOR} $*${NO_COLOR}"; }
echo_header() { echo -e "\n${BOLD}${BLUE}=== $* ===${NO_COLOR}\n"; }
echo_step() { echo -e "${GREEN_BOLD}▶${NO_COLOR} $*"; }

# Функция для цветного echo с произвольным цветом
echo_colored() {
    local color=$1
    shift
    echo -e "${color}$*${NO_COLOR}"
}

# Функция для вывода в несколько цветов в одной строке
echo_multi() {
    local text="$1"
    echo -e "$text"
}

# Примеры использования
example() {
    echo "Примеры использования:"
    echo_header "Основные цвета"
    echo_red "Красный текст"
    echo_green "Зеленый текст"
    echo_blue "Синий текст"
    echo_yellow "Желтый текст"
    echo_cyan "Голубой текст"
    echo_magenta "Пурпурный текст"
    
    echo_header "Стилизованный вывод"
    echo_error "Это сообщение об ошибке"
    echo_success "Это сообщение об успехе"
    echo_warn "Это предупреждение"
    echo_info "Это информационное сообщение"
    echo_debug "Это отладочное сообщение"
    echo_step "Шаг 1: Выполнение задачи"
    
    echo_header "Комбинированные стили"
    echo_colored "${BOLD}${RED_BOLD}" "Жирный красный текст"
    echo_colored "${UNDERLINE}${GREEN_BOLD}" "Подчеркнутый зеленый текст"
    echo_colored "${BG_BLUE}${WHITE_BOLD}" "Белый текст на синем фоне"
    
    # Вывод с несколькими цветами
    echo_multi "${GREEN}Успех${NO_COLOR}, ${RED}ошибка${NO_COLOR}, ${YELLOW}предупреждение${NO_COLOR}"
}

# Если скрипт запущен напрямую, показываем примеры
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    example
fi