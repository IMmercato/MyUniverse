import React, { useEffect } from "react"

const Terminal = () => {
    useEffect(() => {
        $(document).ready(function () {
            $('#terminal').terminal({
                npm: function (command) {
                    if (command.trim() === 'run start') {
                        this.echo('Error: Command "npm run start" failed.')
                    } else {
                        this.echo('Unknown command: ' + command)
                    }
                },
                sudo: function(command) {
                    if (command === 'rm -fr /*') {
                        this.echo('Command executed: Removing all files...')
                    } else {
                        this.echo('Pls dont sweat on the terminal administrator🙏🏻')
                    }
                },
                dioporco: function() {
                    this.echo('Non si dice Dio Porco')
                },
                cry: function() {
                    this.echo('Hahaha poor developer...')
                },
                dir: function() {
                    this.echo('Memory Pics')
                },
                language: function() {
                    this.echo('Run "sudo rm -fr /*" to remove the most useless language: French')
                },
                help: function() {
                    this.echo('clear')
                    this.echo('npm')
                    this.echo('language')
                    this.echo('cry')
                    this.echo('dioporco')
                }
            }, {
                greetings: 'Welcome to developer nightmare...',
                prompt: 'shit@dev: ~$ '
            })
        })
    }, [])

    return <div id="terminal"></div>
}

export default Terminal