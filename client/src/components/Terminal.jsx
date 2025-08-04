import React, { useEffect } from "react"

const Terminal = ({ onCrash }) => {
    useEffect(() => {
        $(document).ready(function () {
            $('#terminal').terminal({
                npm: function (...args) {
                    const command = args.join(' ').trim()
                    if (command === 'run start') {
                        this.echo('Error: Command "npm run start" failed.')
                    } else if (command === '-h') {
                        this.echo('install \nrun start')
                    }else if (command === 'install') {
                        this.echo('Installing dependencies... just kidding!')
                    } else if (command) {
                        this.echo('Unknown npm command: ' + command)
                    } else {
                        this.echo('[Arity] Please specify a command for npm')
                    }
                },
                sudo: function(...args) {
                    const command = args.join(' ').trim()
                    if (command === 'rm -fr /*') {
                        this.echo('Removing French language files...')
                        this.echo('This will cause system instability!')
                        setTimeout(() => {
                            onCrash()
                        }, 1000)
                        setTimeout(() => {
                            this.echo('Just kidding 🤣')
                        }, 7000)
                    } else if (command) {
                        this.echo('Pls dont sweat on the terminal administrator 🙏🏻')
                        this.echo('Attempted command: ' + command)
                    } else {
                        this.echo('[Arity] Please specify a command for sudo')
                    }
                },
                dioporco: function() {
                    this.echo('Non si dice Dio Porco! Mannaggia!')
                },
                cry: function() {
                    this.echo('😭 Hahaha poor developer...')
                },
                dir: function() {
                    this.echo('Memory Pics Minigame')
                },
                language: function() {
                    this.echo('Available commands:')
                    this.echo('  "sudo rm -fr /*" - Remove the most useless language: French')
                    this.echo('  "language list" - Show installed languages')
                },
                help: function() {
                    this.echo('Available commands:')
                    this.echo('  clear - Clear terminal')
                    this.echo('  npm [command] - NPM commands')
                    this.echo('  language - Language options')
                    this.echo('  cry - For when things go wrong')
                    this.echo('  dioporco - Italian frustration')
                    this.echo('  dir - List files')
                    this.echo('  help - This help message')
                },
                clear: function() {
                    this.clear()
                }
            }, {
                greetings: 'Welcome to developer nightmare...',
                prompt: 'shit@dev: ~$ ',
                checkArity: false
            })
        })
    }, [onCrash])

    return <div id="terminal"></div>
}

export default Terminal